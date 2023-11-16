"use server";

import prisma from "@lib/db";

type Dish = {
	id: number;
	name: string;
	categoryID: number;
	courseID: number;
	isAvailable: string;
	price: number;
};

enum isAvailable {
	true = "Available",
	false = "N/A",
}
export async function editDish(dish: Dish) {
	console.log(dish.isAvailable);
	const newDish = await prisma.dish.update({
		data: {
			name: dish.name,
			category: {
				connect: {
					id: dish.categoryID,
				},
			},
			course: {
				connect: {
					id: dish.courseID,
				},
			},
			isAvailable: dish.isAvailable === isAvailable.true,
			price: dish.price,
		},
		where: {
			id: dish.id,
		},
	});

	return newDish;
}

export async function getAllDishes() {
	// Fetch data from your API here.
	const dishes = await prisma.dish.findMany({
		select: {
			id: true,
			name: true,
			category: {
				select: {
					id: true,
					name: true,
				},
			},
			course: true,
			createdAt: true,
			updatedAt: true,
			isAvailable: true,
			price: true,
		},
	});

	return dishes;
}

export async function ddmCategories() {
	return await prisma.category.findMany();
}

export async function ddmCourses() {
	return await prisma.course.findMany();
}
