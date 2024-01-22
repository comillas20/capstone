"use client";

import {
	addDays,
	subMonths,
	isBefore,
	isSameMonth,
	addHours,
	isSameDay,
} from "date-fns";
import { createContext, useState } from "react";
import { buttonVariants } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { cn } from "@lib/utils";
import SetPicker from "./SetPicker";
import { Session } from "next-auth";
import { findNearestNonDisabledDate, getVacantTimeSlot } from "@lib/date-utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select";
import useSWR from "swr";
import { getReservationDates } from "../serverActions";
import { Loader2 } from "lucide-react";

type Venue = {
	id: number;
	name: string;
	location: string;
	freeHours: number;
	venueCost: number;
	maxCapacity: number;
	maintainanceDates: Date[];
};

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
	};
	selectedVenue: Venue;
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
	};
	venues: Venue[];
};
export default function ReservationForm({
	session,
	settings,
	venues,
}: ReservationFormProps) {
	const currentDate = new Date();
	const [selectedVenue, setSelectedVenue] = useState<Venue>(venues[0]);
	// const nearestDateAvailable: Date =
	// 	selectedVenue.maintainanceDates.length > 0
	// 		? findNearestNonDisabledDate(
	// 				addDays(currentDate, 3),
	// 				selectedVenue.maintainanceDates
	// 		  )
	// 		: addDays(currentDate, 3);
	const [date, setDate] = useState<Date | undefined>();
	//Note to self: Date type instead of numbers, so I can use date comparison methods
	const [month, setMonth] = useState<Date>(currentDate);
	const reservations = useSWR(
		"ReservationFormReservationDates",
		getReservationDates
	);

	if (!reservations.data) return <Loader2 className="animate-spin" />;
	return (
		<div className="flex flex-col items-start gap-12 xl:flex-row">
			<ReservationFormContext.Provider
				value={{
					currentDate,
					date,
					month,
					session,
					settings,
					selectedVenue,
				}}>
				<SetPicker />
			</ReservationFormContext.Provider>
			{venues.length > 0 && (
				<div className="flex flex-col gap-8">
					<Select
						onValueChange={value => setSelectedVenue(venues[parseInt(value)])}
						defaultValue={"0"}>
						<SelectTrigger>
							<SelectValue placeholder="Select a venue" />
						</SelectTrigger>
						<SelectContent>
							{venues.map((venue, index) => (
								<SelectItem key={venue.id} value={String(index)}>
									{venue.name.concat(" Branch")}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{selectedVenue && (
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
							disabled={date => {
								const maintainance = selectedVenue.maintainanceDates.find(d =>
									isSameDay(d, date)
								);
								const pastDays = date < addDays(currentDate, 3);
								let reservationToday: typeof reservations.data = [];
								reservations.data?.forEach(r => {
									if (isSameDay(r.eventDate, date)) {
										reservationToday.push(r);
									}
								});
								// keep in mind that this only takes the first reservation in this day
								const restingTime = 3;
								if (reservationToday.length > 0) {
									const timeGaps = reservationToday.map(rt => {
										const result = getVacantTimeSlot({
											openingTime: settings.openingTime,
											closingTime: settings.closingTime,
											eventTime: rt.eventDate,
											eventDuration: rt.eventDuration,
											minRH: settings.minReservationHours,
										});
										return {
											startGap: result.extraHoursAfterMinimumRH_AfterOpeningTimeSlot,
											endGap: result.extraHoursAfterMinimumRH_BeforeClosingTimeSlot,
										};
									});
									const noSlot =
										(timeGaps[0].startGap < settings.minReservationHours + restingTime &&
											timeGaps[timeGaps.length - 1].endGap <
												settings.minReservationHours + restingTime) ||
										timeGaps.length >= 2;
									return !!maintainance || pastDays || noSlot;
								} else {
									return !!maintainance || pastDays;
								}
							}}
							fixedWeeks
							required
						/>
					)}
				</div>
			)}
		</div>
	);
}
