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
	selectedSet: {
		id: number;
		name: string;
		minimumPerHead: number;
		price: number;
	};
	eventDate: Date;
	eventDuration: number;
	eventType: string;
	userID: number;
	userName: string;
	phoneNumber: string;
	totalPrice: number;
	orders: {
		id: number;
		name: string;
	}[];
	message: string;
	venue: string;
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

type Result = {
	data: {
		attributes: {
			checkout_url: string;
		};
	};
};
export async function createCheckoutSession(reserve: Reservation) {
	const random = generateRandomNumbers(10);
	try {
		const data = {
			data: {
				attributes: {
					reference_number: random,
					billing: { name: reserve.userName, phone: String(reserve.phoneNumber) },
					send_email_receipt: true,
					show_description: false,
					show_line_items: true,
					// success_url: "https://jakelou.vercel.app/reservations",
					line_items: [
						{
							currency: "PHP",
							amount: reserve.totalPrice * 100,
							description: "Selected set used for Jakelou event",
							name: reserve.selectedSet.name,
							quantity: 1,
						},
					],
					payment_method_types: ["gcash"],
					statement_descriptor: "Jakelou",
					metadata: {
						userID: reserve.userID,
						eventDate: convertDateToString(reserve.eventDate),
						eventDuration: reserve.eventDuration,
						eventType: reserve.eventType,
						message: reserve.message,
						setName: reserve.selectedSet.name,
						dishes: JSON.stringify(reserve.orders.map(order => order.name)),
						totalPaid: "",
						totalCost: reserve.totalPrice,
						venue: reserve.venue,
					},
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
			"https://api.paymongo.com/v1/checkout_sessions",
			optionsIntent
		);

		const result: Result = await response.json();
		return result;
	} catch (error) {
		console.error("Error:", error);
	}
	return null;
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
		where: {
			userID: userID,
		},
		include: {
			transactions: true,
		},
	});

	const modifiedResult = result.map(({ eventDate, ...others }) => ({
		...others,
		eventDate: utcToZonedTime(eventDate, localTimezone),
	}));

	return modifiedResult;
}

type Reschedule = {
	id: string;
	eventDate: Date;
};
export async function rescheduleReservation({ id, eventDate }: Reschedule) {
	return await prisma.reservations.update({
		where: {
			id: id,
		},
		data: {
			eventDate: eventDate,
		},
	});
}

export async function cancelReservation(id: string) {
	return await prisma.reservations.update({
		where: {
			id: id,
		},
		data: {
			status: "CANCELED",
		},
	});
}
