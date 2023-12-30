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

// export async function doesEmailExists(email: string) {
// 	const isEmailFound = await prisma.account.findUnique({
// 		select: {
// 			id: true,
// 		},
// 		where: {
// 			email: email,
// 		},
// 	});

// 	return !!isEmailFound;
// }

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
