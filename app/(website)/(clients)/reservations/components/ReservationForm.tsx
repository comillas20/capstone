"use client";

import { addDays, subMonths, isBefore, isSameMonth } from "date-fns";
import { createContext, useEffect, useState } from "react";
import { buttonVariants } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { cn } from "@lib/utils";
import SetPicker from "./SetPicker";
import { Session } from "next-auth";
import useSWR from "swr";
import { getSettings } from "@app/(website)/serverActionsGlobal";
export type ReservationFormContextProps = {
	currentDate: Date;
	month: Date;
	date: Date | undefined;
	session: Session | null;
	settings: {
		id: number;
		openingTime: Date;
		closingTime: Date;
		minimumCustomerReservationHours: number;
		maximumCustomerReservationHours: number;
		defaultMinimumPerHead: number;
		reservationCostPerHour: number;
		maintainanceDates?: Date[];
	};
};

export const ReservationFormContext = createContext<
	ReservationFormContextProps | undefined
>(undefined);
export default function ReservationForm({
	session,
}: {
	session: Session | null;
}) {
	const currentDate = new Date();
	const settings = useSWR("settings", getSettings);
	const s2 = settings.data
		? {
				...settings.data,
				maintainanceDates: settings.data.maintainanceDates.map(m => m.date),
		  }
		: null;
	const disabledDays = [
		...(s2 ? s2.maintainanceDates : []),
		{ from: subMonths(currentDate, 1), to: addDays(currentDate, 3) },
	];
	const later: Date | null = s2
		? new Date(Math.max(...s2.maintainanceDates.map(date => date.getTime())))
		: null;
	const defaultSelectableDate = later
		? addDays(later, 1)
		: addDays(currentDate, 3);
	const [date, setDate] = useState<Date | undefined>(defaultSelectableDate);
	//Note to self: Date type instead of Numbers, so I can use date comparison methods
	const [month, setMonth] = useState<Date>(currentDate);
	// necessary
	// apparently state hook declaration outspeed settings.data
	// so @later is always null by the time code reaches here
	useEffect(() => {
		setDate(defaultSelectableDate);
	}, [settings.data]);
	return (
		s2 && (
			<ReservationFormContext.Provider
				value={{
					currentDate,
					date,
					month,
					session,
					settings: s2,
				}}>
				<div className="flex flex-col items-start gap-12 xl:flex-row">
					<SetPicker />
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
			</ReservationFormContext.Provider>
		)
	);
}
