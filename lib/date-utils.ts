import { isSameDay } from "date-fns";
export function findNearestNonDisabledDate(
	today: Date,
	disabledDates: Date[]
): Date {
	let nearestDate = new Date(today);

	// Increment the current date until a non-disabled date is found
	while (true) {
		if (
			!disabledDates.some(disabledDate => isSameDay(nearestDate, disabledDate))
		) {
			return nearestDate;
		}

		nearestDate.setDate(nearestDate.getDate() + 1);
	}
}

/**
 *
 * @param first a Date
 * @param second also a Date
 *
 * the function simply does first - second, and returns te difference
 * @returns the difference of days of the two Date objects provided
 */
export function getDaysBySubtraction(first: Date, second: Date) {
	// Set time to midnight (00:00:00) for both dates
	first.setHours(0, 0, 0, 0);
	second.setHours(0, 0, 0, 0);

	// Calculate the difference in milliseconds
	const timeDifference = first.getTime() - second.getTime();

	// Convert the time difference to days
	const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	return daysDifference;
}
