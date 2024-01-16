"use server";

import { sendSMS } from "@app/(website)/serverActionsGlobal";
import prisma from "@lib/db";
import { generateRandomString } from "@lib/utils";
import bcrypt from "bcrypt";

type Credentials = {
	phoneNumber: string;
	password: string;
	code?: string;
};
type UserData = {
	result: string;
	phoneNumber: string;
};
// creation of Date obj here apparently gets converted to UTC automatically
export async function validateCredentials(
	credentials: Credentials
): Promise<UserData | null> {
	const userFound = await prisma.account.findUnique({
		where: {
			phoneNumber: credentials.phoneNumber,
		},
	});
	console.log("codeTimeStamp on server", userFound?.codeTimeStamp);
	console.log("resendTimeStamp on server", userFound?.resendTimeStamp);
	if (!userFound) return null;
	const password = await bcrypt.compare(
		credentials.password,
		userFound.password
	);
	if (!password) return null;

	if (credentials.code && userFound.codeTimeStamp) {
		const currentTime = new Date();

		// Calculate the time difference in milliseconds
		const timeDifference =
			currentTime.getTime() - userFound.codeTimeStamp.getTime();
		console.log("currentTime", currentTime);
		console.log("userFound.codeTimeStamp", userFound.codeTimeStamp);

		// Convert 30 minutes to milliseconds
		const thirtyMinutesInMillis = 30 * 60 * 1000;

		// Check if the time difference is greater than 30 minutes
		if (timeDifference > thirtyMinutesInMillis) {
			await sendSMSCode(userFound.phoneNumber);
			return { result: "code_expired", phoneNumber: userFound.phoneNumber };
		} else if (credentials.code === userFound.code) {
			return { result: "code_verified", phoneNumber: userFound.phoneNumber };
		}
	} else {
		await sendSMSCode(userFound.phoneNumber);
		return { result: "new_code", phoneNumber: userFound.phoneNumber };
	}
	return null;
}

export async function sendSMSCode(phoneNumber: string) {
	const code = generateRandomString(6).toUpperCase();
	const codeTimeStamp = new Date();

	// Convert 2 minutes to milliseconds
	const twoMinutesInMillis = 2 * 60 * 1000;

	const timeStamp = await prisma.account.findUnique({
		where: {
			phoneNumber: phoneNumber,
		},
		select: {
			resendTimeStamp: true,
		},
	});

	if (timeStamp?.resendTimeStamp) {
		// Calculate the time difference in milliseconds
		const timeDifference =
			codeTimeStamp.getTime() - timeStamp.resendTimeStamp.getTime();
		console.log("codeTimeStamp_sendSMSCOde", codeTimeStamp);
		console.log("timeStamp.resendTimeStamp", timeStamp.resendTimeStamp);

		// returns the remaining time if true in milliseconds
		if (timeDifference < twoMinutesInMillis) {
			return timeDifference;
		}
	}

	try {
		const result = await Promise.all([
			prisma.account.update({
				data: {
					code: code,
					codeTimeStamp: codeTimeStamp,
					resendTimeStamp: codeTimeStamp,
				},
				where: {
					phoneNumber: phoneNumber,
				},
			}),
			async function () {
				const send_data = {
					recipient: phoneNumber,
					message:
						"Your code is " +
						code +
						". This code only lasts for 30 mins. Be mindful when sharing codes",
				};
				await sendSMS(send_data);
			},
		]);

		if (!!result) return twoMinutesInMillis;
	} catch (error) {
		return null;
	}

	return null;
}
