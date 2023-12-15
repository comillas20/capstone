"use client";
import { cn } from "@lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";

export type Meridiem = "AM" | "PM";
type TimePickerProps = {
	className?: string;
	time: Date | undefined;
	onTimeChange: React.Dispatch<React.SetStateAction<Date>>;
	minimumTime?: Date;
	maximumTime?: Date;
};
export default function TimePicker({
	className,
	time,
	onTimeChange,
	minimumTime,
	maximumTime,
}: TimePickerProps) {
	const defaultTime = time ?? new Date();
	const defaultHour = defaultTime.getHours();
	const hours = useRef(defaultHour > 12 ? defaultHour - 12 : defaultHour);
	const minutes = useRef(defaultTime.getMinutes());
	const meridiem = useRef<Meridiem>(defaultHour > 12 ? "PM" : "AM");

	function onTimeChangeHandler(
		hourOrMinute: "HOUR" | "MINUTE" | "MERIDIEM",
		e?: React.ChangeEvent<HTMLInputElement>
	) {
		if (e) {
			const input = parseInt(e.target.value, 10);
			if (hourOrMinute === "HOUR") {
				//For example, if input == 4, 4 % 12 will return 4 because 12 > 4
				//12 % 12 == 0, and 0 is a falsy value, so it sets 12 instead
				hours.current = !isNaN(input) ? input % 12 || 12 : 1;
			} else if (hourOrMinute === "MINUTE") {
				minutes.current = !isNaN(input) ? (input > 59 ? 59 : input) : 0;
			}
		} else if (!e && hourOrMinute === "MERIDIEM") {
			meridiem.current = meridiem.current === "AM" ? "PM" : "AM";
		}
		const timeBruh = time
			? time.setHours(
					meridiem.current === "AM" ? hours.current : hours.current + 12,
					minutes.current
			  )
			: defaultTime.setHours(
					meridiem.current === "AM" ? hours.current : hours.current + 12,
					minutes.current
			  );
		onTimeChange(new Date(timeBruh));
	}
	function setHourLimit() {
		if (maximumTime) {
			const hourLimit = maximumTime.getHours();
			return meridiem.current === "PM" ? hourLimit % 12 || 12 : hourLimit;
		} else return 12;
	}
	const hMax = setHourLimit();
	const hMin = minimumTime ? minimumTime.getHours() : 1;
	const mMax = maximumTime ? maximumTime.getMinutes() : 59;
	const mMin = minimumTime ? minimumTime.getMinutes() : 0;
	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Input
				type="number"
				max={hMax}
				min={hMin}
				value={hours.current}
				onChange={e => onTimeChangeHandler("HOUR", e)}
			/>
			<span>:</span>
			<Input
				type="number"
				max={mMax}
				min={mMin}
				value={minutes.current}
				onChange={e => onTimeChangeHandler("MINUTE", e)}
			/>
			<Button
				type="button"
				variant={"outline"}
				onClick={() => onTimeChangeHandler("MERIDIEM")}>
				{meridiem.current}
			</Button>
		</div>
	);
}
