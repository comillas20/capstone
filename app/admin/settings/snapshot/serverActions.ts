"use server";

import prisma from "@lib/db";

export async function retrieveAllDishCatCoursesForBackUp() {
	const dishes = await prisma.dish.findMany({
		select: {
			name: true,
			createdAt: true,
			isAvailable: true,
			category: {
				select: { name: true },
			},
			course: {
				select: { name: true },
			},
		},
	});
	return dishes.map(dish => ({
		...dish,
		category: dish.category.name,
		course: dish.course.name,
	}));
}
type DCC = {
	category: string;
	course: string;
	name: string;
	createdAt: Date;
	isAvailable: boolean;
}[];
export async function restoreAllDishCatCourses(values: DCC) {
	return await prisma.dish.create({
		data: {
			name: values[0].name,
			isAvailable: values[0].isAvailable,
			course: {
				connectOrCreate: {
					where: {
						name: values[0].course,
					},
					create: {
						name: values[0].course,
					},
				},
			},
			category: {
				create: {
					name: values[0].category,
				},
			},
		},
	});
}

export async function retrieveSetsForBackUp() {
	const sets = await prisma.set.findMany({
		select: {
			name: true,
			price: true,
			minimumPerHead: true,
			createdAt: true,
			updatedAt: true,
			subSets: {
				select: {
					name: true,
					course: {
						select: {
							name: true,
						},
					},
					dishes: {
						select: {
							name: true,
						},
					},
					selectionQuantity: true,
				},
			},
		},
	});

	return sets.map(set => ({
		...set,
		subSets: set.subSets.map(subSet => ({
			...subSet,
			course: subSet.course.name,
			dishes: subSet.dishes.map(dish => dish.name),
		})),
	}));
}
