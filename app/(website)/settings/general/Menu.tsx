"use client";

import TimePicker from "@components/TimePicker";
import { Button, buttonVariants } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { Input } from "@components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";
import { Separator } from "@components/ui/separator";
import { cn } from "@lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";
import { useState } from "react";

export function OpeningHour({ openingTime }: { openingTime?: Date }) {
	// defaults
	const openingHour = openingTime ?? new Date("January 20, 2002 00:00:00");

	const [oTime, setOTime] = useState<Date>(openingHour);
	return (
		<Popover>
			<PopoverTrigger className="text-primary">
				{formatTime(openingHour)}
			</PopoverTrigger>
			<PopoverContent>
				<div className="flex flex-col gap-4">
					<div className="text-sm font-bold">Starting time</div>
					<TimePicker time={oTime} onTimeChange={setOTime} />
				</div>
			</PopoverContent>
		</Popover>
	);
}

export function ClosingHour({ closingTime }: { closingTime?: Date }) {
	// defaults
	const closingHour = closingTime ?? new Date("January 20, 2002 00:00:00");

	const [cTime, setCTime] = useState<Date>(closingHour);
	return (
		<Popover>
			<PopoverTrigger className="text-primary">
				{formatTime(closingHour)}
			</PopoverTrigger>
			<PopoverContent>
				<div className="flex flex-col gap-4">
					<div className="text-sm font-bold">Closing time</div>
					<TimePicker time={cTime} onTimeChange={setCTime} />
				</div>
			</PopoverContent>
		</Popover>
	);
}

function formatTime(time: Date) {
	const hours = time.getHours();
	const minutes = time.getMinutes();
	const meridiem = hours > 12 ? "PM" : "AM";
	const formattedTime = `${String(hours % 12 || 12).padStart(2, "0")}:${String(
		minutes
	).padStart(2, "0")}${meridiem}`;
	return formattedTime;
}

export function MaintainanceDates({
	maintainanceDates,
}: {
	maintainanceDates?: Date[];
}) {
	const [dates, setDates] = useState<Date[] | undefined>(maintainanceDates);
	return (
		<Popover>
			<PopoverTrigger className="text-primary">View</PopoverTrigger>
			<PopoverContent className="w-fit" side="left">
				<Calendar
					className="p-0"
					mode="multiple"
					onSelect={setDates}
					selected={dates}
					classNames={{
						head_cell:
							"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
						cell: cn(
							buttonVariants({ variant: "ghost" }),
							"h-9 w-9 p-0 font-normal aria-selected:opacity-100"
						),
						day: cn(
							buttonVariants({ variant: "ghost" }),
							"h-8 w-8 p-0 font-normal aria-selected:opacity-100"
						),
					}}
					fixedWeeks
				/>
			</PopoverContent>
		</Popover>
	);
}

export function MinimumPerHead({ minHead }: { minHead?: number }) {
	// defaults
	const defaultMinHead = minHead ?? 50;
	const [mh, setMH] = useState(defaultMinHead);
	return (
		<Popover>
			<PopoverTrigger className="text-primary">{mh}</PopoverTrigger>
			<PopoverContent className="space-y-4">
				<div>
					<h4>Minimum packs</h4>
					<p className="text-xs text-muted-foreground">
						Minimum packs customers could order
					</p>
				</div>

				<Input
					type="number"
					value={mh}
					onChange={e => setMH(parseInt(e.target.value))}
				/>
			</PopoverContent>
		</Popover>
	);
}

export function ReservationHours({ min, max }: { min?: number; max?: number }) {
	// defaults
	const defaultMinHour = min ?? 4;
	const defaultMaxHour = max ?? 10;
	const [minHours, setMinHours] = useState(defaultMinHour);
	const [maxHours, setMaxHours] = useState(defaultMaxHour);
	return (
		<Popover>
			<PopoverTrigger className="text-primary">{`${minHours} to ${maxHours}`}</PopoverTrigger>
			<PopoverContent>
				<div className="grid grid-cols-2 gap-4">
					<h4 className="col-span-2 font-medium">Reservation hours</h4>
					<div className="space-y-2">
						<h5>Minimum</h5>
						<Input
							type="number"
							value={minHours}
							onChange={e => setMinHours(parseInt(e.target.value))}
						/>
					</div>
					<div className="space-y-2">
						<h5>Maximum</h5>
						<Input
							type="number"
							value={maxHours}
							onChange={e => setMaxHours(parseInt(e.target.value))}
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export function ReservationCostPerHour({ c }: { c?: number }) {
	// defaults
	const defaultCost = c ?? 500;
	const [cost, setCost] = useState(defaultCost);

	return (
		<Popover>
			<PopoverTrigger className="text-primary">
				{new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "PHP",
				}).format(cost)}
			</PopoverTrigger>
			<PopoverContent className="space-y-4">
				<div>
					<h4>Reservation cost/hour</h4>
					<p className="text-xs text-muted-foreground">
						Reservation cost per hour of usage
					</p>
				</div>

				<Input
					type="number"
					value={cost}
					onChange={e => setCost(parseInt(e.target.value))}
				/>
			</PopoverContent>
		</Popover>
	);
}
