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
