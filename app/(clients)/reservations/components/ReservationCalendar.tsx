"use client";
import { buttonVariants } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { cn } from "@lib/utils";
import { useState } from "react";
import { addDays, addYears, isBefore, isSameMonth } from "date-fns";

export default function ReservationCalendar() {
	const currentDate = new Date();
	const [date, setDate] = useState<Date | undefined>(currentDate);
	const [month, setMonth] = useState<Date>(currentDate);

	return (
		<div className="flex gap-12 px-16">
			<Calendar
				className="rounded-md border"
				mode="single"
				selected={date}
				onSelect={setDate}
				month={month}
				onMonthChange={date => {
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
					addDays(date, 1) < currentDate || date > addYears(date, 1)
				}></Calendar>
			<div className="flex flex-1 flex-col rounded-md">
				<h3 className="mb-8 text-lg">{date?.toDateString()} - Vacants</h3>
				<div>?</div>
			</div>
		</div>
	);
}
