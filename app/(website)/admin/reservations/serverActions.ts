"use server";
import prisma from "@lib/db";
import { convertDateToString } from "@lib/utils";
import { utcToZonedTime } from "date-fns-tz";

// had to do this because prisma auto converts Dates to UTC timezone
// and I can't do anything to make it use local time zone
// so Im converting every Dates I get from Prisma to local

const localTimezone = "Asia/Manila";

export async function getReservations() {
	const result = await prisma.reservations.findMany({
		select: {
			id: true,
			dishes: true,
			eventDate: true,
			eventDuration: true,
			eventType: true,
			setName: true,
			status: true,
			totalCost: true,
			user: {
				select: {
					id: true,
					name: true,
					phoneNumber: true,
				},
			},
			transactions: true,
			venue: true,
			otherServices: true,
			packs: true,
			additionalFees: true,
		},
	});
	const modifiedResult = result.map(
		({ eventDate, user, transactions, ...others }) => ({
			...others,
			eventDate: convertDateToString(utcToZonedTime(eventDate, localTimezone)),
			userID: user.id,
			userName: user.name,
			userPhoneNumber: user.phoneNumber,
			transactions: transactions.map(({ createdAt, ...others }) => ({
				...others,
				createdAt: convertDateToString(utcToZonedTime(createdAt, localTimezone)),
			})),
		})
	);

	return modifiedResult;
}

type Status = "PENDING" | "PARTIAL" | "ONGOING" | "COMPLETED" | "CANCELLED";
export async function changeStatus(id: string, status: Status) {
	return await prisma.reservations.update({
		data: {
			status: status,
		},
		where: {
			id: id,
		},
	});
}

type R = {
	totalCost: number;
	dishes: string[];
	setName: string;
	id: string;
};
export async function updateReservation(r: R) {
	return await prisma.reservations.update({
		data: {
			totalCost: r.totalCost,
			dishes: r.dishes,
			setName: r.setName,
		},
		where: {
			id: r.id,
		},
	});
}
