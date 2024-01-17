"use server";

import prisma from "@lib/db";
import { addMonths, addYears } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

// had to do this because prisma auto converts Dates to UTC timezone
// and I can't do anything to make it use local time zone
// so Im converting every Dates I get from Prisma to local

const localTimezone = "Asia/Manila";
export async function getReservations(date: Date) {
	const result = await prisma.reservations.findMany({
		where: {
			AND: [
				{
					eventDate: {
						gte: date,
					},
				},
				{
					eventDate: {
						lt: addYears(date, 1),
					},
				},
			],
			OR: [
				{
					status: "COMPLETED",
				},
				{
					status: "ONGOING",
				},
			],
		},
	});

	const modifiedResult = result.map(({ eventDate, ...others }) => ({
		...others,
		eventDate: utcToZonedTime(eventDate, localTimezone),
	}));

	return modifiedResult;
}

export async function getAccounts() {
	const result = await prisma.account.findMany({
		where: {
			role: "USER",
		},
		select: {
			createdAt: true,
			id: true,
			name: true,
			phoneNumber: true,
			image: true,
		},
	});

	const modResult = result.map(({ createdAt, ...others }) => ({
		...others,
		createdAt: utcToZonedTime(createdAt, localTimezone),
	}));

	return modResult;
}
