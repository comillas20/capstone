"use server";
import prisma from "@lib/db";
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
			fee: true,
			net_amount: true,
			message: true,
			payment_id: true,
			reservedAt: true,
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
		},
	});
	const modifiedResult = result.map(
		({ eventDate, reservedAt, user, ...others }) => ({
			...others,
			eventDate: utcToZonedTime(eventDate, localTimezone),
			reservedAt: utcToZonedTime(reservedAt, localTimezone),
			user_id: user.id,
			user_name: user.name,
			user_phoneNumber: user.phoneNumber,
		})
	);

	return modifiedResult;
}
