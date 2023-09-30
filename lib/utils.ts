import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getPreferredTheme() {
	const storedTheme =
		typeof window !== "undefined" ? window.localStorage.getItem("theme") : "auto";
	if (storedTheme) {
		return storedTheme;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function setTheme(theme: string) {
	if (theme === "auto") {
		//Note to self: dont even think about unnesting this
		if (window.matchMedia("(prefers-color-scheme: dark)").matches)
			document.documentElement.classList.add("dark");
		else document.documentElement.classList.remove("dark");
	} else if (theme === "dark") document.documentElement.classList.add("dark");
	else document.documentElement.classList.remove("dark");

	typeof window !== "undefined" && window.localStorage.setItem("theme", theme);
}
