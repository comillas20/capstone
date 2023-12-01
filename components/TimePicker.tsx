"use client";
import { cn } from "@lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export type Meridiem = "AM" | "PM";
type CustomTimePickerProps = {
	className?: string;
	hours: number;
	onHoursChange: React.Dispatch<React.SetStateAction<number>>;
	minutes: number;
	onMinutesChange: React.Dispatch<React.SetStateAction<number>>;
	meridiem: Meridiem;
	onMeridiemChange: React.Dispatch<React.SetStateAction<Meridiem>>;
} & React.ComponentProps<typeof Input>;
export default function TimePicker({
	className,
	hours,
	minutes,
	meridiem,
	onHoursChange,
	onMinutesChange,
	onMeridiemChange,
}: CustomTimePickerProps) {
	const onHoursChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = parseInt(e.target.value, 10);
		//For example, if input == 4, 4 % 12 will return 4 because 12 > 4
		//12 % 12 == 0, and 0 is a falsy value, so it sets 12 instead
		const hour = !isNaN(input) ? input % 12 || 12 : 1;
		onHoursChange(hour);
	};

	const onMinutesChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = parseInt(e.target.value, 10);
		const minute = !isNaN(input) ? (input > 59 ? 59 : input) : 0;
		onMinutesChange(minute);
	};

	return (
		<div className={cn("grid grid-cols-3 gap-2", className)}>
			<span className="text-center text-xs font-bold">Hour</span>
			<span className="text-center text-xs font-bold">Minute</span>
			<span className="text-center text-xs font-bold">am/pm</span>
			<Input
				type="number"
				max={12}
				min={1}
				value={hours}
				onChange={onHoursChangeHandler}
			/>
			<Input
				type="number"
				max={59}
				min={1}
				value={minutes}
				onChange={onMinutesChangeHandler}
			/>
			<Button
				variant={"outline"}
				onClick={() => onMeridiemChange(meridiem === "AM" ? "PM" : "AM")}>
				{meridiem}
			</Button>
		</div>
	);
}
