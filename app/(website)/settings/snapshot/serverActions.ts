"use server";

import prisma from "@lib/db";
import { utcToZonedTime } from "date-fns-tz";

// had to do this because prisma auto converts Dates to UTC timezone
// and I can't do anything to make it use local time zone
// so Im converting every Dates I get from Prisma to local

const localTimezone = "Asia/Manila";

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
		createdAt: utcToZonedTime(dish.createdAt, localTimezone),
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
			description: true,
			price: true,
			minimumPerHead: true,
			createdAt: true,
			selectionQuantity: true,
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
				},
			},
			venue: {
				select: {
					name: true,
					location: true,
					freeHours: true,
					venueCost: true,
					maxCapacity: true,
				},
			},
		},
	});

	return sets.map(set => ({
		...set,
		createdAt: utcToZonedTime(set.createdAt, localTimezone),
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
	description: string | null;
	createdAt: Date;
	minimumPerHead: number;
	price: number;
	selectionQuantity: number;
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
	}[];
	venue: {
		name: string;
		location: string;
		freeHours: number;
		maxCapacity: number;
		venueCost: number;
	};
};
export async function restoreSets(values: Set) {
	const newVenue = await prisma.venues.upsert({
		create: {
			name: values.venue.name,
			location: values.venue.location,
			freeHours: values.venue.freeHours,
			maxCapacity: values.venue.maxCapacity,
			venueCost: values.venue.venueCost,
		},
		where: {
			name: values.venue.name,
		},
		update: {
			name: values.venue.name,
			location: values.venue.location,
			freeHours: values.venue.freeHours,
			maxCapacity: values.venue.maxCapacity,
			venueCost: values.venue.venueCost,
		},
	});
	const newSet = await prisma.set.upsert({
		create: {
			name: values.name,
			description: values.description,
			createdAt: values.createdAt,
			minimumPerHead: values.minimumPerHead,
			price: values.price,
			selectionQuantity: values.selectionQuantity,
			venue: {
				connect: {
					id: newVenue.id,
				},
			},
		},
		where: {
			name_venueID: {
				name: values.name,
				venueID: newVenue.id,
			},
		},
		update: {
			name: values.name,
			description: values.description,
			createdAt: values.createdAt,
			minimumPerHead: values.minimumPerHead,
			price: values.price,
			selectionQuantity: values.selectionQuantity,
			venue: {
				connect: {
					id: newVenue.id,
				},
			},
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
			const newSubSet = await prisma.subSets.upsert({
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

export async function retrieveServicesForBackUp() {
	return await prisma.otherServices.findMany();
}

type Service = {
	name: string;
	price: number;
	unit: number | null;
	unitName: string | null;
	isRequired: boolean;
	isAvailable: boolean;
};
export async function restoreServices(service: Service) {
	return await prisma.otherServices.upsert({
		create: service,
		where: {
			name: service.name,
		},
		update: service,
	});
}
