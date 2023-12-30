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
	// const hours = useRef(defaultHour > 12 ? defaultHour - 12 : defaultHour);
	// const minutes = useRef(defaultTime.getMinutes());
	const meridiem = useRef<Meridiem>(defaultHour > 12 ? "PM" : "AM");
	const [initialHourMin, initialHourLimit] = [
		minimumTime ? minimumTime.getHours() : 0,
		maximumTime ? maximumTime.getHours() : 12,
	];
	const [initialMinuteMin, initialMinuteLimit] = [
		minimumTime ? minimumTime.getMinutes() : 0,
		maximumTime ? maximumTime.getMinutes() : 59,
	];
	const [hourMin, setHourMin] = useState<number>(initialHourMin);
	const [hourLimit, setHourLimit] = useState<number>(initialHourLimit);

	// if minimum is set 12pm or after
	useEffect(() => {
		if (initialHourMin >= 12) {
			meridiem.current = "PM";
			setHourMin(initialHourMin % 12 || 12);
			setHourLimit(initialHourLimit % 12);
		}
	}, [initialHourMin, initialHourLimit]);

	const [hours, setHours] = useState<number>(
		defaultHour > 12 ? defaultHour - 12 : defaultHour
	);
	const [minutes, setMinutes] = useState<number>(defaultTime.getMinutes());

	const mMax = hourLimit === hours ? initialMinuteLimit : 59;
	const mMin = hourMin === hours ? initialMinuteMin : 0;
	function onTimeChangeHandler(
		hourOrMinute: "HOUR" | "MINUTE" | "MERIDIEM",
		e?: React.ChangeEvent<HTMLInputElement>
	) {
		if (e) {
			const input = parseInt(e.target.value, 10);
			if (isNaN(input)) return;
			if (hourOrMinute === "HOUR") {
				// hours.current = Math.max(hourMin, Math.min(input, hourLimit));
				setHours(Math.max(hourMin, Math.min(input, hourLimit)));
			} else if (hourOrMinute === "MINUTE") {
				// minutes.current = Math.max(mMin, Math.min(input, mMax));
				setMinutes(Math.max(mMin, Math.min(input, mMax)));
			}
		} else if (!e && hourOrMinute === "MERIDIEM") {
			meridiem.current = meridiem.current === "AM" ? "PM" : "AM";
			setHourMin(
				meridiem.current === "PM"
					? initialHourMin > 12
						? initialHourMin % 12 || 12
						: initialHourMin
					: initialHourMin
			);
			const am = initialHourLimit > 12 ? 12 : initialHourLimit;
			const pm = hourLimit % 12 || 12;
			setHourLimit(meridiem.current === "PM" ? pm : am);
		}
		const timeBruh = time
			? time.setHours(meridiem.current === "AM" ? hours : hours + 12, minutes)
			: defaultTime.setHours(
					meridiem.current === "AM" ? hours : hours + 12,
					minutes
			  );
		onTimeChange(new Date(timeBruh));
	}
	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Input
				type="number"
				value={hours.toString().padStart(2, "0")}
				onChange={e => setHours(parseInt(e.target.value, 10))}
				onBlur={e => onTimeChangeHandler("HOUR", e)}
			/>
			<span>:</span>
			<Input
				type="number"
				max={mMax}
				min={mMin}
				value={minutes.toString().padStart(2, "0")}
				onChange={e => setMinutes(parseInt(e.target.value, 10))}
				onBlur={e => onTimeChangeHandler("MINUTE", e)}
			/>
			<Button
				type="button"
				variant={"outline"}
				onClick={() => onTimeChangeHandler("MERIDIEM")}
				disabled={initialHourMin > 12}>
				{meridiem.current}
			</Button>
		</div>
	);
}
