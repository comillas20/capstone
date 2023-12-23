"use client";

import { addDays, addYears, isBefore, isSameMonth } from "date-fns";
import { createContext, useState } from "react";
import { buttonVariants } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { cn } from "@lib/utils";
import SetPicker from "./SetPicker";
import { Session } from "next-auth";
export type ReservationFormContextProps = {
	currentDate: Date;
	month: Date;
	date: Date | undefined;
	session: Session | null;
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
	const [date, setDate] = useState<Date | undefined>(addDays(currentDate, 3));
	//Note to self: Date type instead of Numbers, so I can use date comparison methods
	const [month, setMonth] = useState<Date>(currentDate);

	return (
		<ReservationFormContext.Provider
			value={{
				currentDate,
				date,
				month,
				session,
			}}>
			<div className="flex flex-col gap-12 xl:flex-row">
				<SetPicker />
				<div>
					{/* the extra div is for calendar to not have same height as SetPicker 
						when SetPicker height > Calendar height*/}
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
							months:
								"flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
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
							day_today: "bg-primary text-primary-foreground opacity-50",
						}}
						disabled={date =>
							addDays(date, 1) < addDays(currentDate, 3) || date > addYears(date, 1)
						}
						fixedWeeks
						required
					/>
				</div>
			</div>
		</ReservationFormContext.Provider>
	);
}
