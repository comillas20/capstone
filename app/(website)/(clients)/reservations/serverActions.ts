"use server";
import prisma from "@lib/db";
import { convertDateToString, generateRandomNumbers } from "@lib/utils";
import { addYears } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

// had to do this because prisma auto converts Dates to UTC timezone
// and I can't do anything to make it use local time zone
// so Im converting every Dates I get from Prisma to local

const localTimezone = "Asia/Manila";

type Reservation = {
	setName: string;
	eventDate: Date;
	eventDuration: number;
	eventType: string;
	totalPrice: number;
	dishes: string[];
	transaction: {
		recipientNumber: string;
		referenceNumber: string;
		message: string;
	};
	userID: number;
	venueID: number;
};
export async function getCurrentUser(currentID: number) {
	return await prisma.account.findUnique({
		where: {
			id: currentID,
		},
		select: {
			id: true,
			name: true,
			phoneNumber: true,
		},
	});
}

export async function createReservation(reserve: Reservation) {
	return await prisma.reservations.create({
		data: {
			eventDate: reserve.eventDate,
			eventDuration: reserve.eventDuration,
			eventType: reserve.eventType,
			setName: reserve.setName,
			totalCost: reserve.totalPrice,
			dishes: reserve.dishes,
			user: {
				connect: {
					id: reserve.userID,
				},
			},
			venue: {
				connect: {
					id: reserve.venueID,
				},
			},
			transactions: {
				create: {
					recipientNumber: reserve.transaction.recipientNumber,
					referenceNumber: reserve.transaction.referenceNumber,
					message: reserve.transaction.message,
				},
			},
		},
	});
}

export async function getALlDishesWithCourses() {
	return await prisma.dish.findMany({
		select: {
			id: true,
			name: true,
			category: {
				select: {
					course: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});
}

export async function getReservations(userID: number) {
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
			transactions: true,
			venue: {
				include: {
					maintainanceDates: true,
				},
			},
		},
		where: {
			user: {
				id: userID,
			},
		},
	});
	const modifiedResult = result.map(
		({ eventDate, transactions, venue, ...others }) => ({
			...others,
			eventDate: convertDateToString(utcToZonedTime(eventDate, localTimezone)),
			transactions: transactions.map(({ createdAt, ...others }) => ({
				...others,
				createdAt: convertDateToString(utcToZonedTime(createdAt, localTimezone)),
			})),
			venue: {
				...venue,
				maintainanceDates: venue.maintainanceDates.map(({ date }) =>
					utcToZonedTime(date, localTimezone)
				),
			},
		})
	);

	return modifiedResult;
}

export async function getReservationDates() {
	const dates = await prisma.reservations.findMany({
		select: {
			eventDate: true,
			eventDuration: true,
		},
		where: {
			NOT: {
				OR: [
					{
						status: "CANCELLED",
					},
					{
						status: "COMPLETED",
					},
				],
			},
		},
	});

	const modifiedResult = dates.map(({ eventDate, ...others }) => ({
		...others,
		eventDate: utcToZonedTime(eventDate, localTimezone),
	}));

	return modifiedResult;
}

type Reschedule = {
	id: string;
	eventDate: Date;
	eventDuration: number;
};
export async function rescheduleReservation(reservation: Reschedule) {
	return await prisma.reservations.update({
		where: {
			id: reservation.id,
		},
		data: {
			eventDate: reservation.eventDate,
			eventDuration: reservation.eventDuration,
		},
	});
}

export async function cancelReservation(id: string) {
	return await prisma.reservations.update({
		where: {
			id: id,
		},
		data: {
			status: "CANCELLED",
		},
	});
}
