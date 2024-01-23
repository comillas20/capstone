"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button, buttonVariants } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@components/ui/dialog";
import { useEffect, useState, useTransition } from "react";
import { Row } from "@tanstack/react-table";
import { Calendar } from "@components/ui/calendar";
import useSWR, { useSWRConfig } from "swr";
import {
	getGCashNumbers,
	getMaintainanceDates,
	getSystemSettings,
} from "@app/(website)/serverActionsGlobal";
import { addDays, isBefore, isSameDay, isSameMonth, subMonths } from "date-fns";
import { cn } from "@lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";
import TimePicker, { Meridiem } from "@components/TimePicker";
import { Separator } from "@components/ui/separator";
import { PopoverClose } from "@radix-ui/react-popover";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Settings } from "@app/(website)/settings/general/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import {
	cancelReservation,
	getReservationDates,
	rescheduleReservation,
	updateReservation,
} from "../serverActions";
import { Reservations } from "./Columns";
import { toast } from "@components/ui/use-toast";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { Input } from "@components/ui/input";
import {
	areTimesConflicting,
	getDaysBySubtraction,
	getVacantTimeSlot,
} from "@lib/date-utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select";
import { Textarea } from "@components/ui/textarea";

interface DataTableRowActionsProps {
	row: Row<Reservations>;
}
export function DataTableRowActions({ row }: DataTableRowActionsProps) {
	const maintainanceDates = useSWR("EditReservationMD", getMaintainanceDates);
	const settings = useSWR("EditReservationSettings", getSystemSettings);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
	const [isPayDialogOpen, setIsPayDialogOpen] = useState<boolean>(false);

	if (!settings.data && !maintainanceDates.data)
		return <Loader2 className="animate-spin" size={15} />;

	const openingHours = settings.data?.find(
		setting => setting.name === Settings.openingHour
	);
	const closingHours = settings.data?.find(
		setting => setting.name === Settings.closingHour
	);
	const minRH = settings.data?.find(
		setting => setting.name === Settings.minReservationHours
	);
	const maxRH = settings.data?.find(
		setting => setting.name === Settings.maxReservationHours
	);
	const today = new Date();
	const allowedToResched =
		isBefore(addDays(today, 3), new Date(row.original.eventDate)) &&
		(row.original.status === "PENDING" || row.original.status === "PARTIAL");
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
						<DotsHorizontalIcon className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[160px]">
					{maintainanceDates.data && allowedToResched && (
						<DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
							Reschedule
						</DropdownMenuItem>
					)}
					{!(
						row.original.status === "CANCELLED" ||
						row.original.status === "COMPLETED" ||
						row.original.status === "ONGOING"
					) && (
						<DropdownMenuItem onSelect={() => setIsPayDialogOpen(true)}>
							Pay
						</DropdownMenuItem>
					)}
					{!(
						row.original.status === "CANCELLED" || row.original.status === "COMPLETED"
					) && (
						<DropdownMenuItem onSelect={() => setIsCancelDialogOpen(true)}>
							Cancel
						</DropdownMenuItem>
					)}
					{/* <DropdownMenuItem onSelect={() => setIsDetailDialogOpen(true)}>
						Details
					</DropdownMenuItem> */}
				</DropdownMenuContent>
			</DropdownMenu>
			{maintainanceDates.data && (
				<EditReservation
					data={row}
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					openingHours={openingHours?.value}
					closingHours={closingHours?.value}
					minRH={minRH?.value}
					maxRH={maxRH?.value}
				/>
			)}
			<Details open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen} />
			<CancelDialog
				data={row}
				open={isCancelDialogOpen}
				onOpenChange={setIsCancelDialogOpen}
			/>
			<Pay data={row} open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen} />
		</>
	);
}

type EditReservationProps = {
	data: Row<Reservations>;
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	openingHours?: string | number | Date;
	closingHours?: string | number | Date;
	minRH?: string | number | Date;
	maxRH?: string | number | Date;
};
function EditReservation({
	data,
	open,
	onOpenChange,
	openingHours,
	closingHours,
	minRH,
	maxRH,
}: EditReservationProps) {
	const currentDate = new Date();
	const [date, setDate] = useState<Date | undefined>();
	//Note to self: Date type instead of numbers, so I can use date comparison methods
	const [month, setMonth] = useState<Date>(currentDate);

	const [time, setTime] = useState<Date>(new Date(data.original.eventDate)); //24 hour, to store in database
	const formatTime = (hours: number, min: number) => {
		const meridiem: Meridiem = hours >= 12 ? "PM" : "AM";
		return `${String(hours % 12 || 12).padStart(2, "0")}:${String(min).padStart(
			2,
			"0"
		)}${meridiem}`;
	};

	// for display, other than gatekeeping user, data not so important
	const defaultTimeLinkName = "Set time";
	const [timeLinkName, setTimeLinkName] = useState<string>(
		formatTime(time.getHours(), time.getMinutes())
	);
	const [timeError, setTimeError] = useState<string>();
	const [eventDuration, setEventDuration] = useState(
		data.original.eventDuration
	);

	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();
	const reservations = useSWR(
		"ReservationDRAReservationAllDates",
		getReservationDates
	);

	useEffect(() => {
		if (date && reservations.data) {
			const vacants = reservations.data.find(r => isSameDay(r.eventDate, date))
				? getVacantTimeSlot({
						openingTime: openingHours as Date,
						closingTime: closingHours as Date,
						eventDuration: eventDuration,
						eventTime: date,
						minRH: minRH as number,
				  })
				: undefined;
			if (
				areTimesConflicting({
					openingTime: openingHours as Date,
					closingTime: closingHours as Date,
					eventDuration: eventDuration,
					eventTime: date,
					minRH: minRH as number,
					newTime: time,
					openingEventDateStartGap:
						vacants?.extraHoursAfterMinimumRH_AfterOpeningTimeSlot,
					closingEventDateEndGap:
						vacants?.extraHoursAfterMinimumRH_BeforeClosingTimeSlot,
				})
			) {
				setTimeError("It is already occupied");
			}
		} else setTimeError(undefined);
	}, [time, date, eventDuration, reservations.data]);
	if (!reservations.data) return <div></div>;
	else
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<div className="flex flex-col">
						<Calendar
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
								const maintainance = data.original.venue.maintainanceDates.find(d =>
									isSameDay(d, date)
								);
								const pastDays = date < addDays(currentDate, 2);
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
											openingTime: openingHours as Date,
											closingTime: closingHours as Date,
											eventTime: rt.eventDate,
											eventDuration: rt.eventDuration,
											minRH: minRH as number,
										});
										return {
											startGap: result.extraHoursAfterMinimumRH_AfterOpeningTimeSlot,
											endGap: result.extraHoursAfterMinimumRH_BeforeClosingTimeSlot,
										};
									});
									const noSlot =
										(timeGaps[0].startGap < (minRH as number) + restingTime &&
											timeGaps[timeGaps.length - 1].endGap <
												(minRH as number) + restingTime) ||
										timeGaps.length >= 2;
									return !!maintainance || pastDays || noSlot;
								} else {
									return !!maintainance || pastDays;
								}
							}}
							fixedWeeks
							required
						/>
						<div className="flex gap-8 p-3">
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-sm font-bold">
									Start of event
									{(timeLinkName === defaultTimeLinkName || timeError) && (
										<AlertTriangle
											className="text-yellow-500 dark:text-yellow-300"
											size={15}
										/>
									)}
								</div>
								<Popover>
									<PopoverTrigger
										className={buttonVariants({
											variant: "link",
											className: "cursor-pointer text-primary",
										})}
										disabled={!date}>
										{timeLinkName}
									</PopoverTrigger>
									<PopoverContent className="w-64 drop-shadow">
										<div className="flex flex-col gap-4">
											<div className="text-sm font-bold">
												What time do you want to start?
											</div>
											<TimePicker
												time={time}
												onTimeChange={setTime}
												minimumTime={
													openingHours
														? new Date(openingHours)
														: new Date("January 20, 2002 00:00:00")
												}
												maximumTime={
													closingHours
														? new Date(closingHours)
														: new Date("January 20, 2002 00:00:00")
												}
											/>
											<Separator className="my-2" />
											<div className="flex justify-end">
												<PopoverClose asChild>
													<Button
														onClick={() => {
															const hours = time.getHours();
															const minutes = time.getMinutes();
															const meridiem: Meridiem = hours >= 12 ? "PM" : "AM";
															const formattedTime = `${String(hours % 12 || 12).padStart(
																2,
																"0"
															)}:${String(minutes).padStart(2, "0")}${meridiem}`;
															if (time) setTimeLinkName(formattedTime);
														}}>
														Save
													</Button>
												</PopoverClose>
											</div>
										</div>
									</PopoverContent>
								</Popover>
								{timeLinkName !== defaultTimeLinkName && timeError && (
									<p className="col-start-3 text-sm font-semibold text-destructive">
										{timeError}
									</p>
								)}
							</div>
							<div className="space-y-1">
								<div className="flex items-center text-sm font-bold">Renting Hours</div>
								<Popover>
									<PopoverTrigger
										className={buttonVariants({
											variant: "link",
											className: "cursor-pointer text-primary",
										})}
										disabled={!date}>
										{eventDuration + " hours"}
									</PopoverTrigger>
									<PopoverContent className="w-52 drop-shadow">
										<h5 className="font-bold">Renting Hours</h5>
										<p className="text-sm text-muted-foreground">
											Minimum of{" "}
											<strong className="font-bold">{(minRH as number) + " hours"}</strong>
										</p>
										<Separator className="my-2" />
										<div className="flex items-center gap-4">
											<Input
												className="w-24"
												type="number"
												max={maxRH as number}
												min={minRH as number}
												value={eventDuration.toString()}
												onChange={e => {
													const tu = parseInt(e.target.value, 10);
													setEventDuration(tu);
												}}
												onBlur={e => {
													const tu = parseInt(e.target.value, 10);
													if (
														!isNaN(tu) &&
														(tu < (minRH as number) || tu > (maxRH as number))
													) {
														setEventDuration(minRH as number);
													}
												}}
											/>
											<span className="font-bold">Hours</span>
										</div>
									</PopoverContent>
								</Popover>
							</div>
						</div>
					</div>
					<div className="flex justify-end">
						<Button
							onClick={() => {
								const id = data.original.id;
								const eventDate = date
									? new Date(
											date.getFullYear(),
											date.getMonth(),
											date.getDate(),
											time.getHours(),
											time.getMinutes()
									  )
									: null;
								startSaving(async () => {
									const result = eventDate
										? await rescheduleReservation({ id, eventDate, eventDuration })
										: null;
									if (result) {
										toast({
											title: "Success",
											description: "Your reservation is rescheduled.",
											duration: 5000,
										});
										mutate("ReservationListData");
									}
								});
							}}
							disabled={isSaving}>
							{isSaving && <Loader2 className="mr-2 animate-spin" />}
							Save
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
}

type CancelDialogProps = {
	data: Row<Reservations>;
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

function CancelDialog({ data, open, onOpenChange }: CancelDialogProps) {
	const { mutate } = useSWRConfig();
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
					<AlertDialogDescription className="text-destructive">
						This action cannot be undo. Continue?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={async () => {
							const result = await cancelReservation(data.original.id);
							if (result) {
								toast({
									title: "Success",
									description: "The reservation is successfully cancelled.",
									duration: 5000,
								});
								mutate("ReservationListData");
								mutate("ReservationFormReservationDates");
							}
						}}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

type Details = {
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};
function Details({ open, onOpenChange }: Details) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="link" className="inline cursor-pointer text-primary">
							{/* {timeLinkName} */}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-64 drop-shadow">
						<div className="flex flex-col gap-4">
							<div className="text-sm font-bold">What time do you want to start?</div>
							{/* <TimePicker
								time={time}
								onTimeChange={setTime}
								minimumTime={
									openingHours
										? new Date(openingHours)
										: new Date("January 20, 2002 00:00:00")
								}
								maximumTime={
									closingHours
										? new Date(closingHours)
										: new Date("January 20, 2002 00:00:00")
								}
							/> */}
							<Separator className="my-2" />
							<div className="flex justify-end">
								<PopoverClose asChild>
									<Button
										onClick={() => {
											// const hours = time.getHours();
											// const minutes = time.getMinutes();
											// const meridiem: Meridiem = hours >= 12 ? "PM" : "AM";
											// const formattedTime = `${String(hours % 12 || 12).padStart(
											// 	2,
											// 	"0"
											// )}:${String(minutes).padStart(2, "0")}${meridiem}`;
											// if (time) setTimeLinkName(formattedTime);
										}}>
										Save
									</Button>
								</PopoverClose>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</DialogContent>
		</Dialog>
	);
}

type PayProps = {
	data: Row<Reservations>;
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};
function Pay({ data, open, onOpenChange }: PayProps) {
	const GCashNumbers = useSWR("PayGCashNumbers", getGCashNumbers);
	const [recipientNumber, setRecipientNumber] = useState<string>("");
	const [referenceNumber, setReferenceNumber] = useState<string>("");
	const [message, setMessage] = useState<string>();
	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();
	const currentDate = new Date();
	if (!GCashNumbers.data) return <div></div>;
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Payment</DialogTitle>
					<DialogDescription>Pay through G-cash</DialogDescription>
				</DialogHeader>
				<Separator />
				<div className="space-y-4">
					<p>
						{`You can send your down payment of 20% (${new Intl.NumberFormat(
							"en-US",
							{
								style: "currency",
								currency: "PHP",
							}
						).format(
							data.original.totalCost * 0.2
						)}) or full payment to any G-Cash number listed below:`}
					</p>
					<div className="grid grid-cols-3 gap-2">
						<div className="col-span-2 space-y-2">
							{GCashNumbers.data.map(gcash => (
								<div key={gcash.id} className="flex justify-between">
									<span>{gcash.name}</span>
									<span>{gcash.phoneNumber}</span>
								</div>
							))}
						</div>
					</div>
					<p>The admin will review your reservation before it gets accepted</p>
					{getDaysBySubtraction(new Date(data.original.eventDate), currentDate) ===
						3 && (
						<p className="font-semibold text-destructive">
							As there are only three (3) days left, it is required that you pay the
							full amount.
						</p>
					)}
				</div>
				<div className="flex gap-4">
					<div className="flex-1 space-y-2">
						<h3 className="text-sm font-bold">Recipient Number</h3>
						<Select value={recipientNumber} onValueChange={setRecipientNumber}>
							<SelectTrigger>
								<SelectValue placeholder="Pick receiver" />
							</SelectTrigger>
							<SelectContent>
								{GCashNumbers.data.map(gcash => (
									<SelectItem key={gcash.id} value={gcash.phoneNumber}>
										<span>{gcash.name}</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex-1 space-y-2">
						<h3 className="text-sm font-bold">Reference Number</h3>
						<Input
							value={referenceNumber}
							onChange={e => {
								const isNumber = !isNaN(+e.target.value);
								if (isNumber) setReferenceNumber(e.target.value);
							}}
							placeholder="GCash reference number"
						/>
					</div>
				</div>
				<div className="space-y-2">
					<h3 className="text-sm font-bold">Message</h3>
					<Textarea value={message} onChange={e => setMessage(e.target.value)} />
				</div>
				<p className="font-semibold">
					*The reference number will be your ticket, please do screenshot your
					transaction details after paying for quick identification at the chosen
					venue
				</p>

				<DialogFooter className="mt-4 flex gap-4">
					<DialogClose
						className={buttonVariants({ variant: "secondary" })}
						type="button">
						Back
					</DialogClose>
					<Button
						onClick={() => {
							startSaving(async () => {
								if (recipientNumber && referenceNumber) {
									const result = await updateReservation({
										id: data.original.id,
										recipientNumber: recipientNumber.trim(),
										referenceNumber: referenceNumber.trim(),
										message: message?.trim(),
									});
									if (result) {
										toast({
											title: "Success",
											description: "The reservation is now sent to admin to check",
											duration: 5000,
										});
									}
									mutate("ReservationListData");
									mutate("ReservationFormReservationDates");
								}
							});
						}}
						disabled={isSaving || !recipientNumber.trim() || !referenceNumber.trim()}>
						{isSaving && <Loader2 className="mr-2 animate-spin" />}Reserve
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
