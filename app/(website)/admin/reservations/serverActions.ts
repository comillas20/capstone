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

export async function cancelReservation(
	id: string,
	amount: number,
	payment_id: string
) {
	const data = {
		data: {
			attributes: {
				amount: amount * 100,
				notes: "denied",
				payment_id: payment_id,
				reason: "others",
			},
		},
	};
	const optionsIntent = {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Basic ${Buffer.from(
				process.env.PAYMONGO_SECRET as string
			).toString("base64")}`, // HTTP Basic Auth and Encoding
		},
		body: JSON.stringify(data),
	};
	const response = await fetch(
		"https://api.paymongo.com/refunds",
		optionsIntent
	);
	const result = await response.json();
	return await prisma.reservations.update({
		where: {
			id: id,
		},
		data: {
			status: "CANCELED",
		},
	});
}
