"use server";
import prisma from "@lib/db";

export async function getAllSets() {
	return await prisma.set.findMany({
		select: {
			id: true,
			name: true,
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
							course: true,
							isAvailable: true,
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
	return await prisma.category.findMany();
}

export async function getAllCourses() {
	return await prisma.course.findMany();
}
