"use server";
import prisma from "@lib/db";
import https from "https";

type Reservation = {
	eventDate: Date;
	userID: number;
	userName: string;
	phoneNumber: string | null;
	email: string | null;
	totalPrice: number;
	eventDuration: number;
	orders: {
		id: number;
		name: string;
	}[];
};
export async function getCurrentUser(currentID: number) {
	return await prisma.account.findUnique({
		where: {
			id: currentID,
		},
		select: {
			id: true,
			name: true,
			email: true,
			phoneNumber: true,
		},
	});
}
export async function createReservation(reserve: Reservation) {
	try {
		const attributes = {
			livemode: false,
			type: "gcash",
			amount: reserve.totalPrice,
			currency: "PHP",
			redirect: {},
			billing: reserve,
		};
		const data = {
			app_key: process.env.PAYMONGO_APP_KEY as string,
			secret_key: process.env.PAYMONGO_SECRET_KEY as string,
			password: process.env.PAYMONGO_PASSWORD as string,
			data: {
				attributes,
			},
		};
		const response = await fetch(process.env.PAYMONGO_URL as string, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();
		console.log("result", result);
		// 		result {
		//   status: 500,
		//   message: 'The remote server returned an error: (400) Bad Request.',
		//   url_redirect: 'https://api4wrd.kpa.ph/payment/failed/90481501253907?message=The remote server returned an error: (400) Bad Request.',
		//   references: { method: 'Source', ukayra_id: '90481501253907', paymongo_id: null }
		// }

		const createdReservation = await prisma.reservations.create({
			data: {
				eventDate: reserve.eventDate,
				eventDuration: reserve.eventDuration,
				totalPrice: reserve.totalPrice,
				orders: {
					connect: reserve.orders.map(order => ({
						id: order.id,
					})),
				},
				reservedAt: new Date(),
				userID: reserve.userID,
			},
			include: {
				user: {
					select: {
						name: true,
						email: true,
						phoneNumber: true,
					},
				},
			},
		});

		return createdReservation.id;
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
