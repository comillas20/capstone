"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, addYears, isBefore, isSameMonth } from "date-fns";
import { useState } from "react";
import { sets, additional_services } from "./temp";
import { Button, buttonVariants } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
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
import { cn } from "@lib/utils";
import SetCards from "./SetCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { CheckboxWithText } from "@components/CheckboxWithText";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Separator } from "@components/ui/separator";
import useSWR, { useSWRConfig } from "swr";
import { getAllCategories, getAllCourses, getAllSets } from "../serverActions";
import SetPicker from "./SetPicker";
import PaymentDialog from "./PaymentDialog";
import { getAllDishes } from "@app/(clients)/clientServerActions";

export default function ReservationForm() {
	const [selectedDishIDs, setSelectedDishIDs] = useState<
		{ subSetName: string; dishID: number }[]
	>([]);
	const [prerequisiteToDialog, setPrerequisiteToDialog] = useState<number>(1);
	const currentDate = new Date();
	const [date, setDate] = useState<Date | undefined>(addDays(currentDate, 3));
	//Note to self: Date type instead of Numbers, so I can use date comparison methods
	const [month, setMonth] = useState<Date>(currentDate);
	const allDishes = useSWR("rfGetAllDishes", getAllDishes);
	return (
		<>
			<SetPicker
				setSelectedDishIDs={setSelectedDishIDs}
				setPrerequisiteToDialog={setPrerequisiteToDialog}
			/>
			{/* Bottom half */}
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
					fixedWeeks
				/>
				<div className="flex max-h-[26.425rem] flex-1 flex-col rounded-md border px-4 py-3">
					<h3 className="mb-3 text-lg">{date?.toDateString()} - Vacants</h3>
					<hr className="mb-4" />
					<ScrollArea>
						{allDishes.data && (
							<PaymentDialog
								dishesByCourse={(() => {
									const allSelectedDishes = allDishes.data.filter(dish =>
										selectedDishIDs.map(d => d.dishID).includes(dish.id)
									);
									const dishesByCourses: {
										[key: string]: {
											id: Number;
											name: string;
											price: number;
										}[];
									} = {};
									allSelectedDishes.forEach(dish => {
										const key = dish.course.name;

										if (!dishesByCourses[key]) {
											dishesByCourses[key] = [];
										}
										dishesByCourses[key].push({
											id: dish.id,
											name: dish.name,
											price: dish.price,
										});
									});
									return dishesByCourses;
								})()}>
								<Button disabled={selectedDishIDs.length < prerequisiteToDialog}>
									9:00am | Brgy. Taft, Narciso St., Surigao City
								</Button>
							</PaymentDialog>
						)}

						<ScrollBar />
					</ScrollArea>
				</div>
			</div>
		</>
	);
}
