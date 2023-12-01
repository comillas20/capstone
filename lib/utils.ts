import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const themeSchema = z.enum(["dark", "light", "auto"]);
export function getPreferredTheme() {
	// window object is undefined when this function is called in the server, not client
	const storedTheme =
		typeof window !== "undefined" ? window.localStorage.getItem("theme") : "auto";

	try {
		const validatedTheme = themeSchema.parse(storedTheme);
		return validatedTheme;
	} catch (error) {
		// if the stored theme is not one of the allowed values, like theme being undefined
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}
}

export function setTheme(theme: z.infer<typeof themeSchema>) {
	if (theme === "auto") {
		//Note to self: dont even think about unnesting this
		if (window.matchMedia("(prefers-color-scheme: dark)").matches)
			document.documentElement.classList.add("dark");
		else document.documentElement.classList.remove("dark");
	} else if (theme === "dark") document.documentElement.classList.add("dark");
	else document.documentElement.classList.remove("dark");

	typeof window !== "undefined" && window.localStorage.setItem("theme", theme);
}

export function convertDateToString(date: Date) {
	const dateOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	} as Intl.DateTimeFormatOptions;

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
