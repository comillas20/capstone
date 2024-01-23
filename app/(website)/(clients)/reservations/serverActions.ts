"use server";
import { sendSMS } from "@app/(website)/serverActionsGlobal";
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
	packs: number;
	dishes: string[];
	transaction: {
		recipientNumber: string;
		referenceNumber: string;
		message: string;
	};
	userID: number;
	venueID: number;
	otherServices: string[];
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
			packs: reserve.packs,
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
			otherServices: {
				connect: reserve.otherServices.map(os => ({ name: os })),
			},
		},
	});
}

type UpdateReservationProps = {
	id: string;
	recipientNumber: string;
	referenceNumber: string;
	message?: string;
};
export async function updateReservation(u: UpdateReservationProps) {
	return await prisma.transactions.create({
		data: {
			recipientNumber: u.recipientNumber,
			referenceNumber: u.referenceNumber,
			reservation: {
				connect: {
					id: u.id,
				},
			},
			message: u.message,
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
			otherServices: true,
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
	const result = await prisma.reservations.update({
		where: {
			id: id,
		},
		data: {
			status: "CANCELLED",
		},
		include: {
			venue: true,
		},
	});

	if (result) {
		const admin = await prisma.account.findFirst({
			where: {
				role: "ADMIN",
			},
			select: {
				phoneNumber: true,
			},
		});
		if (admin) {
			const eventDate = convertDateToString(
				utcToZonedTime(result.eventDate, localTimezone)
			);
			const venue = result.venue.name.concat(" @ ", result.venue.location);
			const res = await sendSMS({
				message: `Reservation at ${venue} ${eventDate} has been cancelled by the customer.`,
				recipient: admin.phoneNumber,
			});
		}
	}
	return result;
}
