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

export async function FAQAlreadyExists({ question, answer }: FAQ) {
	const result = await prisma.fAQ.findUnique({
		where: {
			question_answer: {
				question: question,
				answer: answer,
			},
		},
		select: {
			id: true,
		},
	});

	return result;
}

export async function deleteFAQ({ id }: FAQ) {
	return await prisma.fAQ.delete({
		where: {
			id: id,
		},
	});
}

type GCashNumber = {
	id?: number;
	name?: string;
	phoneNumber?: string;
};
export async function doesAlreadyExist(entry: GCashNumber) {
	const instanceFound = await prisma.gCashNumbers.findFirst({
		where: {
			OR: [
				{
					name: entry.name,
				},
				{
					phoneNumber: entry.phoneNumber,
				},
			],
		},
		select: {
			id: true,
		},
	});

	return !!instanceFound;
}

export async function createOrUpdateGCashNumber({
	id,
	name,
	phoneNumber,
}: GCashNumber) {
	if (!id || !name || !phoneNumber) return undefined;
	return await prisma.gCashNumbers.upsert({
		create: {
			name: name,
			phoneNumber: phoneNumber,
		},
		where: {
			id: id,
		},
		update: {
			name: name,
			phoneNumber: phoneNumber,
		},
	});
}

export async function deleteGCashNumber({ id }: GCashNumber) {
	return await prisma.gCashNumbers.delete({
		where: {
			id: id,
		},
	});
}
