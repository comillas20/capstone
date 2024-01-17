"use server";
import { sendSMS } from "@app/(website)/serverActionsGlobal";
import prisma from "@lib/db";
import { generateRandomString } from "@lib/utils";
import bcrypt from "bcrypt";
export async function doesNameExists(name: string) {
	const isNameFound = await prisma.account.findUnique({
		select: {
			id: true,
		},
		where: {
			name: name,
		},
	});
	return !!isNameFound;
}

export async function doesPhoneNumberExists(phoneNumber: string) {
	const isPhoneNumberFound = await prisma.account.findUnique({
		select: {
			id: true,
		},
		where: {
			phoneNumber: phoneNumber,
		},
	});

	return !!isPhoneNumberFound;
}

type UserData = {
	name: string;
	phoneNumber: string;
	password: string;
	role: "ADMIN" | "USER";
	code?: string;
};

export async function createNewAccount(data: UserData) {
	const accountCount = await prisma.account.count();
	if (accountCount === 0) {
		data.role = "ADMIN";
	}
	const hashedPassword = await bcrypt.hash(data.password, 10);
	return await prisma.account.create({
		data: { ...data, password: hashedPassword },
	});
}

export async function getCode(data: UserData) {
	const code = generateRandomString(6).toUpperCase();
	const message = `You're almost done with your registration. Your code is ${code}.`;
	const result = await sendSMS({
		recipient: data.phoneNumber,
		message: message,
	});

	return result === "success"
		? { phoneNumber: data.phoneNumber, code: code }
		: null;
}
