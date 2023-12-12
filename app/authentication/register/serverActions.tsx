"use server";
import prisma from "@lib/db";
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

export async function doesEmailExists(email: string) {
	const isEmailFound = await prisma.account.findUnique({
		select: {
			id: true,
		},
		where: {
			email: email,
		},
	});

	return !!isEmailFound;
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
	email?: string;
	phoneNumber?: string;
	password: string;
	role: "ADMIN" | "USER";
};

export async function createNewAccount(data: UserData) {
	const hashedPassword = await bcrypt.hash(data.password, 10);
	console.log(data);
	return await prisma.account.create({
		data: { ...data, password: hashedPassword },
	});
}
