"use server";
import prisma from "@lib/db";
import { utcToZonedTime } from "date-fns-tz";

// had to do this because prisma auto converts Dates to UTC timezone
// and I can't do anything to make it use local time zone
// so Im converting every Dates I get from Prisma to local

const localTimezone = "Asia/Manila";
export async function getAllSets() {
	const result = await prisma.set.findMany({
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
	return result.map(set => ({
		...set,
		createdAt: utcToZonedTime(set.createdAt, localTimezone),
		updatedAt: utcToZonedTime(set.updatedAt, localTimezone),
	}));
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
	const result = await prisma.dish.findMany({
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
	return result.map(dish => ({
		...dish,
		createdAt: utcToZonedTime(dish.createdAt, localTimezone),
		updatedAt: utcToZonedTime(dish.updatedAt, localTimezone),
	}));
}

export async function getAllServices() {
	return await prisma.otherServices.findMany();
}

export async function getMaintainanceDates() {
	const result = await prisma.maintainanceDates.findMany();
	return result.map(mD => ({
		date: utcToZonedTime(mD.date, localTimezone),
	}));
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

export async function getReservations() {
	return await prisma.reservations.findMany();
}
