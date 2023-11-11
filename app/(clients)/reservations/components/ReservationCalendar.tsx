"use client";
import { Button, buttonVariants } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { cn } from "@lib/utils";
import { useState } from "react";
import { addDays, addYears, isBefore, isSameMonth } from "date-fns";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

export default function ReservationCalendar() {
	const currentDate = new Date();
	const [date, setDate] = useState<Date | undefined>(addDays(currentDate, 3));
	const [month, setMonth] = useState<Date>(currentDate);

	return (
		<div className="flex gap-12">
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
					addDays(date, 1) < addDays(currentDate, 3) || date > addYears(date, 1)
				}
				fixedWeeks></Calendar>
			<div className="flex max-h-[26.425rem] flex-1 flex-col rounded-md border px-4 py-3">
				<h3 className="mb-3 text-lg">{date?.toDateString()} - Vacants</h3>
				<hr className="mb-4" />
				<ScrollArea>
					<Dialog>
						<DialogTrigger asChild>
							<Button>{date?.getHours()}</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Confirmation</DialogTitle>
								<DialogDescription>
									Corfirm your orders here and click next
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<ul>
									<li>Some chicken dish</li>
									<li>Some pork dish</li>
									<li>Some canton dish</li>
								</ul>
							</div>
							<DialogFooter>
								<DialogClose>
									<Button type="submit">Save changes</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<ScrollBar />
				</ScrollArea>
			</div>
		</div>
	);
}
