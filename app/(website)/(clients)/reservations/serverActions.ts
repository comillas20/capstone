"use server";
import prisma from "@lib/db";

type Reservation = {
	eventDate: Date;
	userID: String;
	totalPrice: number;
	eventDuration: number;
	orders: {
		id: Number;
		name: string;
		price: number;
	}[];
};
export async function createReservation() {}

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
