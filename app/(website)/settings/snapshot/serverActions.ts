"use server";

import prisma from "@lib/db";

export async function retrieveAllDishCatCoursesForBackUp() {
	const dishes = await prisma.dish.findMany({
		select: {
			name: true,
			createdAt: true,
			isAvailable: true,
			imgHref: true,
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
	imgHref: string | null;
};
export async function restoreDishCatCourse(values: DCC) {
	const [course, dishes] = await prisma.$transaction([
		prisma.course.upsert({
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
		}),
		prisma.dish.upsert({
			create: {
				name: values.name,
				category: {
					connect: { name: values.category },
				},
				createdAt: values.createdAt,
				imgHref: values.imgHref,
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
				imgHref: values.imgHref,
				isAvailable: values.isAvailable,
			},
		}),
	]);

	return { ...course, ...dishes };
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
							isAvailable: true,
							imgHref: true,
							category: {
								select: {
									name: true,
								},
							},
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
			dishes: subSet.dishes.map(dish => ({
				...dish,
				category: dish.category.name,
			})),
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
		dishes: {
			name: string;
			createdAt: Date;
			isAvailable: boolean;
			category: string;
			course: string;
			imgHref: string | null;
		}[];
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
			const course = await prisma.course.upsert({
				create: {
					name: subSet.course,
				},
				where: {
					name: subSet.course,
				},
				update: {
					name: subSet.course,
				},
			});
			const newSubSet = await prisma.subSet.upsert({
				create: {
					name: subSet.name,
					setID: newSet.id,
					courseID: course.id,
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
				},
			});
			const dishes = await Promise.all(
				subSet.dishes.map(
					async dish =>
						await prisma.dish.upsert({
							create: {
								name: dish.name,
								category: {
									connectOrCreate: {
										create: { name: dish.category, courseID: course.id },
										where: { name: dish.category },
									},
								},
								createdAt: dish.createdAt,
								imgHref: dish.imgHref,
								isAvailable: dish.isAvailable,
								subSet: {
									connect: { id: newSubSet.id },
								},
							},
							where: {
								name: dish.name,
							},
							update: {
								category: {
									connectOrCreate: {
										create: { name: dish.category, courseID: course.id },
										where: { name: dish.category },
									},
								},
								createdAt: dish.createdAt,
								imgHref: dish.imgHref,
								isAvailable: dish.isAvailable,
								subSet: {
									connect: { id: newSubSet.id },
								},
							},
							include: {
								subSet: true,
							},
						})
				)
			);

			return { ...newSubSet, course: { ...course }, dishes: { ...dishes } };
		})
	);

	return { ...newSet, subSets: newSubSets };
}
