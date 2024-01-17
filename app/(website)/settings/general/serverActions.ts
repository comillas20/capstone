"use server";

import prisma from "@lib/db";
type Setting = {
	name: string;
	type: "int" | "float" | "string" | "date";
	value: string;
};
export async function createOrUpdateSystemSetting(setting: Setting) {
	return await prisma.systemSettings.upsert({
		create: {
			name: setting.name,
			type: setting.type,
			value: setting.value,
		},
		where: {
			name: setting.name,
		},
		update: {
			value: setting.value,
		},
	});
}

export async function updateMaintainanceDates(dates: Date[]) {
	// const [d, c] = await prisma.$transaction([
	// 	prisma.maintainanceDates.deleteMany(),
	// 	prisma.maintainanceDates.createMany({
	// 		data: dates.map(d => ({ date: d })),
	// 	}),
	// ]);
	// return c;
}

type FAQ = {
	id: number;
	question: string;
	answer: string;
};
export async function createOrUpdateFAQ({ id, question, answer }: FAQ) {
	return await prisma.fAQ.upsert({
		create: {
			question: question,
			answer: answer,
		},
		where: {
			id: id,
		},
		update: {
			question: question,
			answer: answer,
		},
	});
}

export async function deleteFAQ({ id }: FAQ) {
	return await prisma.fAQ.delete({
		where: {
			id: id,
		},
	});
}
