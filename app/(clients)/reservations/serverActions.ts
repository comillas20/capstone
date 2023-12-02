"use server";
import prisma from "@lib/db";

export async function getAllSets() {
	const sets = await prisma.set.findMany({
		select: {
			id: true,
			name: true,
			subSets: {
				select: {
					id: true,
					name: true,
					dishes: {
						select: {
							id: true,
							name: true,
							category: true,
							course: true,
							isAvailable: true,
							price: true,
						},
					},
					course: {
						select: {
							id: true,
							name: true,
						},
					},
					selectionQuantity: true,
				},
			},
			createdAt: true,
			updatedAt: true,
		},
	});

	return sets;
}

export async function getAllCategories() {
	const categories = await prisma.category.findMany();
	return categories;
}

export async function getAllCourses() {
	return await prisma.course.findMany();
}

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
