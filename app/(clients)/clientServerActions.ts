"use server";

import prisma from "@lib/db";

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
					course: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
			createdAt: true,
			updatedAt: true,
		},
	});
}

export async function getAllDishes() {
	return await prisma.dish.findMany({
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
}
