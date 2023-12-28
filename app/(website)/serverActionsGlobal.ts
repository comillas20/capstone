"use server";
import prisma from "@lib/db";

export async function getAllSets() {
	return await prisma.set.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			minimumPerHead: true,
			price: true,
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
							imgHref: true,
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
}

export async function getAllCategories() {
	return await prisma.category.findMany({
		select: {
			id: true,
			name: true,
			course: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});
}

export async function getAllCourses() {
	return await prisma.course.findMany({
		orderBy: {
			id: "asc",
		},
	});
}

export async function getAllDishes() {
	return await prisma.dish.findMany({
		select: {
			id: true,
			name: true,
			category: true,
			createdAt: true,
			updatedAt: true,
			isAvailable: true,
			imgHref: true,
		},
	});
}

export async function getAllServices() {
	return await prisma.otherServices.findMany();
}

export async function getSettings() {
	const settings = await prisma.adminSettings.findUnique({
		where: { id: 1 },
		include: {
			maintainanceDates: {
				select: {
					date: true,
				},
			},
		},
	});

	const rework = settings
		? {
				...settings,
				maintainanceDates: settings.maintainanceDates.map(m => m.date),
		  }
		: null;
	return rework;
}
