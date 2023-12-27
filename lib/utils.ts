import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertDateToString(
	date: Date,
	options?: {
		year?: boolean;
		month?: boolean;
		day?: boolean;
		hour?: boolean;
		minute?: boolean;
	}
) {
	const dateOptions: Intl.DateTimeFormatOptions = !!options
		? {
				year: options.year ? "numeric" : undefined,
				month: options.month ? "short" : undefined,
				day: options.day ? "numeric" : undefined,
				hour: options.hour ? "numeric" : undefined,
				minute: options.minute ? "numeric" : undefined,
				hour12: true,
		  }
		: {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
				hour12: true,
		  };

	return date.toLocaleString("en-US", dateOptions);
}
/**
 *
 * @param time must be in hh:mm format
 * @returns time in 12 hour format
 */
export function convertTimeTo12HourFormat(time: string) {
	const date = new Date(`2000-01-01T${time}`);
	const dateOptions = {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	} as Intl.DateTimeFormatOptions;
	return date.toLocaleTimeString([], dateOptions);
}

export function isEmailValid(email: string): boolean {
	// Regular expression for a simple email validation
	const emailRegex = /^[^\s@]+@[^\s@]{3,}\.[^\s@]{2,}$/;
	return emailRegex.test(email);
}

export function isPhoneNumberValid(phoneNumber: string): boolean {
	const phoneNumberRegex = /^(\+63|0)[1-9]\d{9}$/;
	return phoneNumberRegex.test(phoneNumber);
}

/**
 * Converts an Excel serial number or date string to a formatted date and time string.
 *
 * @param {string} excelCellValue - The Excel serial number or date string to convert.
 * @returns {string | null} The formatted date and time string or null if the date is not valid.
 *
 * @example
 * const validExcelSerialNumber: string = "45258.1173611111";
 * const formattedDate1: string | null = convertExcelValueToDateString(validExcelSerialNumber);
 * console.log(formattedDate1); // Output: "20/11/2023 08:25:25"
 *
 * @example
 * const validExcelDateString: string = "20/11/2023";
 * const formattedDate2: string | null = convertExcelValueToDateString(validExcelDateString);
 * console.log(formattedDate2); // Output: "20/11/2023 00:00:00" (start of the day)
 *
 * @example
 * const invalidExcelCellValue: string = "Not a valid input";
 * const formattedDate3: string | null = convertExcelValueToDateString(invalidExcelCellValue);
 * console.log(formattedDate3); // Output: null
 */
export function convertExcelValueToDateString(
	excelCellValue: string
): string | null {
	let excelSerialNumber: number;

	// Try parsing the input string as a date
	const dateValue = new Date(excelCellValue);

	// Check if the parsing was successful and the date is valid
	if (!isNaN(dateValue.getTime())) {
		// Calculate the Excel serial number from the parsed date
		const excelBaseDate = new Date("1900-01-01");
		const daysDifference = Math.floor(
			(dateValue.getTime() - excelBaseDate.getTime()) / (24 * 60 * 60 * 1000)
		);
		const fractionOfDay =
			(dateValue.getHours() * 3600 +
				dateValue.getMinutes() * 60 +
				dateValue.getSeconds()) /
			(24 * 60 * 60);
		excelSerialNumber = daysDifference + fractionOfDay;
	} else {
		// Return null if the input string is not a valid date
		return null;
	}

	// Continue with the existing logic for Excel serial numbers
	// Extract days and fraction of a day
	const days = Math.floor(excelSerialNumber);
	const fractionOfDay = excelSerialNumber - days;

	// Convert days to milliseconds and add to the Excel base date
	const excelBaseDate = new Date("1900-01-01");
	const resultDate = new Date(
		excelBaseDate.getTime() + days * 24 * 60 * 60 * 1000
	);

	// Check if the result date is a valid date
	if (isNaN(resultDate.getTime())) {
		// Return null if not a valid date
		return null;
	}

	// Convert fraction of a day to hours, minutes, and seconds
	const totalSeconds = fractionOfDay * 24 * 60 * 60;
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = Math.floor(totalSeconds % 60);

	// Format the result as a string
	const formattedResult = `${resultDate.toLocaleDateString()} ${hours}:${minutes}:${seconds}`;

	return formattedResult;
}

export const DISHES_IMAGE_FOLDER = "jakelou/dishes/";
export const AVATAR_IMAGE_FOLDER = "profile_images/";
type CloudinaryPresets = "DISHES" | "PROFILE_IMAGES";

/**
 *
 * @param file The image file to be uploaded
 * @param filename The filename of the image to be uploaded.
 * @param upload_preset The upload preset, set in cloudinary -> upload tab
 * @returns The image link
 */
export async function uploadImage(
	file: File,
	filename: string,
	upload_preset: CloudinaryPresets
) {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", upload_preset);
	formData.append("public_id", filename);

	const response = await fetch(
		`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
		{
			method: "POST",
			body: formData,
		}
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const data = await response.json();
	return data.secure_url;
}

export function generateRandomString(length: number): string {
	const charset =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		result += charset[randomIndex];
	}

	return result;
}

export function imageWrapper(
	file: File,
	filename: string,
	upload_preset: CloudinaryPresets
) {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", upload_preset);
	formData.append("public_id", filename);

	return formData;
}
