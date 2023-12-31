"use client";

import { addDays, subMonths, isBefore, isSameMonth } from "date-fns";
import { createContext, useState } from "react";
import { buttonVariants } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { cn } from "@lib/utils";
import SetPicker from "./SetPicker";
import { Session } from "next-auth";
import { findNearestNonDisabledDate } from "@lib/date-utils";
export type ReservationFormContextProps = {
	currentDate: Date;
	month: Date;
	date: Date | undefined;
	session: Session | null;
	settings: {
		openingTime: Date;
		closingTime: Date;
		minReservationHours: number;
		maxReservationHours: number;
		minPerHead: number;
		reservationCostPerHour: number;
	};
};

export const ReservationFormContext = createContext<
	ReservationFormContextProps | undefined
>(undefined);

type ReservationFormProps = {
	session: Session | null;
	settings: {
		openingTime: Date;
		closingTime: Date;
		minReservationHours: number;
		maxReservationHours: number;
		minPerHead: number;
		reservationCostPerHour: number;
	};
	maintainanceDates: Date[];
};
export default function ReservationForm({
	session,
	settings,
	maintainanceDates,
}: ReservationFormProps) {
	const currentDate = new Date();
	const disabledDays = [
		...(maintainanceDates.length > 0 ? maintainanceDates : []),
		{ from: subMonths(currentDate, 2), to: addDays(currentDate, 2) },
	];
	const nearestDateAvailable: Date =
		maintainanceDates.length > 0
			? findNearestNonDisabledDate(addDays(currentDate, 3), maintainanceDates)
			: addDays(currentDate, 3);
	const [date, setDate] = useState<Date | undefined>(nearestDateAvailable);
	//Note to self: Date type instead of numbers, so I can use date comparison methods
	const [month, setMonth] = useState<Date>(currentDate);
	return (
		<div className="flex flex-col items-start gap-12 xl:flex-row">
			<ReservationFormContext.Provider
				value={{
					currentDate,
					date,
					month,
					session,
					settings,
				}}>
				<SetPicker />
			</ReservationFormContext.Provider>
			<Calendar
				className="rounded-md border"
				mode="single"
				selected={date}
				onSelect={setDate}
				month={month}
				onMonthChange={date => {
					//Note to self: reading this is @currentDate isBefore @date ?, same way with isSameMonth
					if (isBefore(currentDate, date) || isSameMonth(currentDate, date))
						setMonth(date);
					// where @date is the current date the user is looking at and @currentdate is today's date
				}}
				classNames={{
					head_cell:
						"text-muted-foreground rounded-md w-12 font-normal text-[0.8rem]",
					cell: cn(
						buttonVariants({ variant: "ghost" }),
						"h-12 w-12 p-0 font-normal aria-selected:opacity-100"
					),
					day: cn(
						buttonVariants({ variant: "ghost" }),
						"h-11 w-11 p-0 font-normal aria-selected:opacity-100"
					),
					day_disabled: "bg-muted text-muted-foreground opacity-50",
					day_today: "bg-primary text-primary-foreground opacity-50",
				}}
				disabled={disabledDays}
				fixedWeeks
				required
			/>
		</div>
	);
}
