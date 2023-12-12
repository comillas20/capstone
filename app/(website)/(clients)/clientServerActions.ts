"use server";

import prisma from "@lib/db";
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
		},
	});
}
