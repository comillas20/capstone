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
	DialogContent,
	DialogHeader,
	DialogClose,
} from "@components/ui/dialog";
import { useState, useTransition } from "react";
import { Row, Table } from "@tanstack/react-table";
import { Calendar } from "@components/ui/calendar";
import useSWR, { useSWRConfig } from "swr";
import {
	getMaintainanceDates,
	getSystemSettings,
} from "@app/(website)/serverActionsGlobal";
import { addDays, isBefore, isSameDay, isSameMonth, subMonths } from "date-fns";
import { findNearestNonDisabledDate } from "@lib/date-utils";
import { cn } from "@lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";
import TimePicker, { Meridiem } from "@components/TimePicker";
import { Separator } from "@components/ui/separator";
import { PopoverClose } from "@radix-ui/react-popover";
import { Loader2 } from "lucide-react";
import { Settings } from "@app/(website)/settings/general/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Input } from "@components/ui/input";
import { cancelReservation, rescheduleReservation } from "../serverActions";
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

interface DataTableRowActionsProps {
	row: Row<Reservations>;
	table: Table<Reservations>;
}
export function DataTableRowActions({ row, table }: DataTableRowActionsProps) {
	const maintainanceDates = useSWR("EditReservationMD", getMaintainanceDates);
	const settings = useSWR("EditReservationSettings", getSystemSettings);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false);
	const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
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
					{maintainanceDates.data && (
						<DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
							Reschedule
						</DropdownMenuItem>
					)}
					<DropdownMenuItem onSelect={() => setIsCancelDialogOpen(true)}>
						Cancel
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setIsDetailDialogOpen(true)}>
						Details
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{maintainanceDates.data && (
				<EditReservation
					data={row}
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					maintainanceDates={maintainanceDates.data.map(md => md.date)}
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
		</>
	);
}

type EditReservationProps = {
	data: Row<Reservations>;
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	maintainanceDates: Date[];
	openingHours?: string | number | Date;
	closingHours?: string | number | Date;
	minRH?: string | number | Date;
	maxRH?: string | number | Date;
};
function EditReservation({
	data,
	open,
	onOpenChange,
	maintainanceDates,
	openingHours,
	closingHours,
	minRH,
	maxRH,
}: EditReservationProps) {
	const currentDate = new Date();
	const disabledDays = [
		...(maintainanceDates.length > 0 ? maintainanceDates : []),
		{ from: subMonths(currentDate, 2), to: addDays(currentDate, 2) },
	];
	const [date, setDate] = useState<Date | undefined>(data.original.eventDate);
	//Note to self: Date type instead of numbers, so I can use date comparison methods
	const [month, setMonth] = useState<Date>(currentDate);

	const [time, setTime] = useState<Date>(data.original.eventDate); //24 hour, to store in database

	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<Tabs defaultValue="calendar">
					<TabsContent value="calendar" className="flex justify-center">
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
							disabled={disabledDays}
							fixedWeeks
							required
						/>
					</TabsContent>
					<TabsContent value="time" className="flex pt-4">
						<div className="flex flex-col gap-4">
							<div className="text-sm font-bold">What time do you want to start?</div>
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
						</div>
					</TabsContent>
					<div className="mt-8 flex justify-between">
						<TabsList>
							<TabsTrigger value="calendar">Date</TabsTrigger>
							<TabsTrigger value="time">Time</TabsTrigger>
						</TabsList>
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
										? await rescheduleReservation({ id, eventDate })
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
				</Tabs>
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
							if (result) mutate("ReservationListData");
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
							{/* {timeLinkName} */}was
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
