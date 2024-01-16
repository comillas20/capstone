"use server";

import { sendSMS } from "@app/(website)/serverActionsGlobal";
import prisma from "@lib/db";
import { generateRandomString } from "@lib/utils";
import bcrypt from "bcrypt";

type Credentials = {
	phoneNumber: string;
	password: string;
};
export async function validateCredentials(credentials: Credentials) {
	const userFound = await prisma.account.findUnique({
		where: {
			phoneNumber: credentials.phoneNumber,
		},
	});
	if (!userFound) return null;
	const password = await bcrypt.compare(
		credentials.password,
		userFound.password
	);
	if (!password) return null;

	const code = generateRandomString(6).toUpperCase();
	const codeTimeStamp = new Date();
	// const user = await prisma.account.update({
	// 	data: {
	// 		code: code,
	// 		codeTimeStamp: codeTimeStamp,
	// 	},
	// 	where: {
	// 		phoneNumber: userFound.phoneNumber,
	// 	},
	// });
	const send_data = {
		recipient: userFound.phoneNumber,
		message:
			"Your code is " +
			code +
			". This code only lasts for 30 mins. Be careful of sharing codes",
	};
	await sendSMS(send_data);
	return { ...userFound, code: code, codeTimeStamp: codeTimeStamp };
}
