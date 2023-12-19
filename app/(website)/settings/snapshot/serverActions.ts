"use server";

import prisma from "@lib/db";

export async function retrieveAllDishCatCoursesForBackUp() {
	const dishes = await prisma.dish.findMany({
		select: {
			name: true,
			createdAt: true,
			isAvailable: true,
			category: {
				select: {
					name: true,
					course: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});
	return dishes.map(dish => ({
		...dish,
		category: dish.category.name,
		course: dish.category.course.name,
	}));
}
type DCC = {
	name: string;
	createdAt: Date;
	isAvailable: boolean;
	category: string;
	course: string;
};
export async function restoreDishCatCourse(values: DCC) {
	const newCourse = await prisma.course.upsert({
		create: {
			name: values.course,
			categories: {
				connectOrCreate: {
					create: { name: values.category },
					where: { name: values.category },
				},
			},
		},
		where: {
			name: values.course,
		},
		update: {
			name: values.course,
			categories: {
				connectOrCreate: {
					create: { name: values.category },
					where: { name: values.category },
				},
			},
		},
	});
	const newDish = await prisma.dish.upsert({
		create: {
			name: values.name,
			category: {
				connect: { name: values.category },
			},
			createdAt: values.createdAt,
			isAvailable: values.isAvailable,
		},
		where: {
			name: values.name,
		},
		update: {
			name: values.name,
			category: {
				connect: { name: values.category },
			},
			createdAt: values.createdAt,
			isAvailable: values.isAvailable,
		},
	});

	return { ...newCourse, ...newDish };
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

type Set = {
	name: string;
	createdAt: Date;
	minimumPerHead: number;
	price: number;
	subSets: {
		course: string;
		dishes: string[];
		name: string;
		selectionQuantity: number;
	}[];
};
export async function restoreSets(values: Set) {
	const newSet = await prisma.set.upsert({
		create: {
			name: values.name,
			createdAt: values.createdAt,
			minimumPerHead: values.minimumPerHead,
			price: values.price,
		},
		where: {
			name: values.name,
		},
		update: {
			name: values.name,
			createdAt: values.createdAt,
			minimumPerHead: values.minimumPerHead,
			price: values.price,
		},
	});
	const newSubSets = await Promise.all(
		values.subSets.map(async subSet => {
			// First, find the course
			let course = await prisma.course.findUnique({
				where: { name: subSet.course },
			});

			// If the course doesn't exist, create it
			if (!course) {
				course = await prisma.course.create({
					data: { name: subSet.course },
				});
			}

			return prisma.subSet.upsert({
				create: {
					name: subSet.name,
					setID: newSet.id,
					courseID: course.id,
					dishes: {
						connect: subSet.dishes.map(dish => ({
							name: dish,
						})),
					},
				},
				where: {
					name_setID: {
						name: subSet.name,
						setID: newSet.id,
					},
				},
				update: {
					name: subSet.name,
					setID: newSet.id,
					courseID: course.id,
					dishes: {
						connect: subSet.dishes.map(dish => ({
							name: dish,
						})),
					},
				},
			});
		})
	);

	return { ...newSet, subSets: newSubSets };
}
