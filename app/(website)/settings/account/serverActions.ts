"use server";
import prisma from "@lib/db";
import bcrypt from "bcrypt";
export async function getAccountID(name: string) {
	const { id } = (await prisma.account.findUnique({
		select: {
			id: true,
		},
		where: {
			name: name,
		},
	})) as { id: number };
	return id;
}
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
	id: number;
	name: string;
	image: string | null;
	phoneNumber: string;
	password?: string;
};

export async function editUserAccount(data: UserData) {
	const hashedPassword = data.password
		? await bcrypt.hash(data.password, 10)
		: undefined;
	const imageWithFolder = data.image ?? undefined;
	const user = await prisma.account.update({
		data: { ...data, image: imageWithFolder, password: hashedPassword },
		where: {
			id: data.id,
		},
	});
	const { password, ...rest } = user;
	return rest;
}

// export async function replaceProfileImage(image: File) {
// 	const arrayBuffer = await image.arrayBuffer();
// 	const buffer = new Uint8Array(arrayBuffer);
// 	await new Promise((resolve, reject) => {
// 		cloudinary.v2.uploader
// 			.upload_stream({}, function (error, result) {
// 				if (error) {
// 					reject(error);
// 					return;
// 				}
// 				resolve(result);
// 			})
// 			.end(buffer);
// 	});
// }
