"use server";
import prisma from "@lib/db";
import { generateRandomNumbers } from "@lib/utils";

type Reservation = {
	selectedSet: {
		id: number;
		name: string;
		minimumPerHead: number;
		price: number;
	};
	eventDate: Date;
	userID: number;
	userName: string;
	phoneNumber: string;
	totalPrice: number;
	eventDuration: number;
	orders: {
		id: number;
		name: string;
	}[];
	message: string;
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
						eventDate: reserve.eventDate.toDateString(),
						eventDuration: reserve.eventDuration,
						message: reserve.message,
						setName: reserve.selectedSet.name,
						dishes: JSON.stringify(reserve.orders.map(order => order.name)),
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
