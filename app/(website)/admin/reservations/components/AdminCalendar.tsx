"use client";

import { Calendar } from "@components/ui/calendar";
import { addDays, isBefore, isSameMonth } from "date-fns";
import { useState } from "react";

export default function AdminCalendar() {
	const currentDate = new Date();
	const [month, setMonth] = useState<Date>(currentDate);
	return (
		<div>
			<Calendar
				className="rounded-md border"
				month={month}
				onMonthChange={date => {
					//Note to self: reading this is @currentDate isBefore @date ?, same way with isSameMonth
					if (isBefore(currentDate, date) || isSameMonth(currentDate, date))
						setMonth(date);
					// where @date is the current date the user is looking at and @currentdate is today's date
				}}
				mode="single"
				disabled={date => addDays(date, 1) < addDays(currentDate, 3)}
			/>
		</div>
	);
}
