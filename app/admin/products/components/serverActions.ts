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

export async function createDish(dish: Dish) {
	const newDish = await prisma.dish.create({
		data: {
			name: dish.name,
			isAvailable: dish.isAvailable === isAvailable.true,
			price: dish.price,
			categoryID: dish.categoryID,
			courseID: dish.courseID,
		},
	});

	return newDish;
}
export async function editDish(dish: Dish) {
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

export async function deleteDishes(dishes: number[]) {
	const yeetedDishes = await prisma.dish.deleteMany({
		where: {
			id: {
				in: dishes,
			},
		},
	});

	return yeetedDishes;
}

export async function getAllDishes() {
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
type categoryCourse = {
	id: number;
	name: string;
};
export async function createCategory(category: string) {
	return await prisma.category.create({
		data: {
			name: category,
		},
	});
}
export async function editCategory(data: categoryCourse) {
	return await prisma.category.update({
		data: {
			name: data.name,
		},
		where: {
			id: data.id,
		},
	});
}
export async function getAllCategories() {
	return await prisma.category.findMany();
}
export async function deleteCategory(id: number) {
	return await prisma.category.delete({
		where: {
			id: id,
		},
	});
}

export async function createCourse(course: string) {
	return await prisma.course.create({
		data: {
			name: course,
		},
	});
}
export async function editCourse(data: categoryCourse) {
	return await prisma.course.update({
		data: {
			name: data.name,
		},
		where: {
			id: data.id,
		},
	});
}
export async function getAllCourses() {
	return await prisma.course.findMany();
}
export async function deleteCourse(id: number) {
	return await prisma.course.delete({
		where: {
			id: id,
		},
	});
}

export async function getAllSets() {
	return await prisma.set.findMany({
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
							isAvailable: true,
							price: true,
						},
					},
					course: true,
				},
			},
			createdAt: true,
			updatedAt: true,
		},
	});
}

// await prisma.dish.update({
// 	where: { id: 55 },
// 	data: { subSet: { connect: { id: 18 } } },
// });

async function addDishToSubSet() {
	await prisma.dish.update({
		where: { id: 55 },
		data: { subSet: { connect: { id: 18 } } },
	});
}

//temp
export async function deleteSubsets() {
	return await prisma.subSet.deleteMany();
}
