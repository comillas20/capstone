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

export async function getMaintainanceDates() {
	return await prisma.maintainanceDates.findMany();
}

export async function getFAQs() {
	return await prisma.fAQ.findMany();
}

export async function getSystemSettings() {
	const settings = await prisma.systemSettings.findMany();
	return settings.map(setting => ({
		name: setting.name,
		value: convertValue(setting.type, setting.value),
	}));
}
export async function getSystemSetting(name: string) {
	const setting = await prisma.systemSettings.findUnique({
		where: {
			name: name,
		},
	});
	return setting ? convertValue(setting.type, setting.value) : null;
}

type SettingType = "int" | "float" | "string" | "date";

interface TypeMap {
	int: number;
	float: number;
	string: string;
	date: Date;
}

function convertValue<T extends SettingType>(
	type: T,
	value: string
): TypeMap[T] {
	switch (type) {
		case "int":
			return parseInt(value) as TypeMap[T];
		case "float":
			return parseFloat(value) as TypeMap[T];
		case "string":
			return value as TypeMap[T];
		case "date":
			return new Date(value) as TypeMap[T];
		default:
			throw new Error(`Unsupported type: ${type}`);
	}
}
