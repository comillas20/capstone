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
 * the function simply does first - second, and returns the difference
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

export function getHoursByAddition(date1: Date, date2: Date) {
	// Calculate the sum of the time in milliseconds
	const timeSum = date1.getTime() + date2.getTime();

	// Convert the time sum to hours
	const hoursSum = Math.floor(timeSum / (1000 * 60 * 60));

	return hoursSum;
}

/**
 *
 * @param first a Date
 * @param second also a Date
 *
 * the function simply does first - second, and returns the difference
 * @returns the difference of hours of the two Date objects provided
 */
export function getHoursBySubtraction(first: Date, second: Date) {
	// Calculate the difference in milliseconds
	const timeDifference = first.getTime() - second.getTime();

	// Convert the time difference to hours
	const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

	return hoursDifference;
}

type ReservationSlot = {
	openingTime: Date;
	closingTime: Date;
	minRH: number;
	eventTime: Date;
	eventDuration: number;
};
// to get dates that are not reserved yet, to also determine if a date can still be reserved or not
export function getVacantTimeSlot({
	openingTime,
	closingTime,
	eventTime,
	eventDuration,
	minRH,
}: ReservationSlot) {
	const midnightConverter = (hour: number) => {
		// getHours returns 0-23, 0 being the midnight
		// but doing something like 0 (midnight) - 17 (5PM) will produce -17 instead of 7
		// so im converting it to 24 so 24 - 17 = 7 which is the correct output
		return hour === 0 ? 24 : hour;
	};
	const restingTime = 3; //hours;
	const closingWholeDaydifference =
		24 - midnightConverter(closingTime.getHours());

	const openingEventTimeDifference =
		midnightConverter(eventTime.getHours()) -
		midnightConverter(openingTime.getHours());

	const openingEventTimeHourDiff =
		midnightConverter(eventTime.getHours()) -
		midnightConverter(openingTime.getHours());

	const closingEventTimeHourDiff =
		24 -
		eventDuration -
		restingTime -
		closingWholeDaydifference -
		openingEventTimeDifference -
		midnightConverter(openingTime.getHours());
	const extraHoursAfterMinimumRH_AfterOpeningTimeSlot =
		openingEventTimeHourDiff - restingTime - minRH;
	const extraHoursAfterMinimumRH_BeforeClosingTimeSlot =
		closingEventTimeHourDiff - minRH;

	// console.log(
	// 	midnightConverter(closingTime.getHours()),
	// 	"midnightConverter(closingTime.getHours())"
	// );
	// console.log(
	// 	midnightConverter(eventTime.getHours()),
	// 	"midnightConverter(eventTime.getHours())"
	// );
	// console.log(eventDuration, "eventDuration");
	// console.log(closingEventTimeHourDiff, "closingEventTimeHourDiff");
	// console.log(minRH, "minRH");
	// console.log("close", extraHoursAfterMinimumRH_BeforeClosingTimeSlot);
	return {
		extraHoursAfterMinimumRH_AfterOpeningTimeSlot,
		extraHoursAfterMinimumRH_BeforeClosingTimeSlot,
	};
}

type Conflict = {
	openingEventDateStartGap?: number;
	closingEventDateEndGap?: number;
	newTime: Date;
} & ReservationSlot;
export function areTimesConflicting({
	openingTime,
	closingTime,
	eventTime,
	eventDuration,
	minRH,
	openingEventDateStartGap,
	closingEventDateEndGap,
	newTime,
}: Conflict) {
	const midnightConverter = (hour: number) => {
		// getHours returns 0-23, 0 being the midnight
		// but doing something like 0 (midnight) - 17 (5PM) will produce -17 instead of 7
		// so im converting it to 24 so 24 - 17 = 7 which is the correct output
		return hour === 0 ? 24 : hour;
	};
	const restingTime = 3; //hours;
	const hours = eventTime.getHours();
	const isVacantBeforeEventStart = openingEventDateStartGap
		? openingEventDateStartGap >= minRH + restingTime
		: true;
	const isVacantAfterEventEnd = closingEventDateEndGap
		? closingEventDateEndGap >= minRH + restingTime
		: true;
	const reservedEventStart = isVacantBeforeEventStart
		? midnightConverter(hours)
		: midnightConverter(openingTime.getHours());
	const reservedEventEnd = isVacantAfterEventEnd
		? midnightConverter(hours) + eventDuration + restingTime
		: midnightConverter(closingTime.getHours());
	return (
		reservedEventStart <= midnightConverter(newTime.getHours()) &&
		midnightConverter(newTime.getHours()) < reservedEventEnd
	);
}
