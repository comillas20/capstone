"use client";

import { addDays, addYears, isBefore, isSameMonth } from "date-fns";
import { createContext, useState } from "react";
import { Button, buttonVariants } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { cn } from "@lib/utils";
import useSWR, { useSWRConfig } from "swr";
import SetPicker from "./SetPicker";
import PaymentDialog from "./PaymentDialog";
import { getAllDishes } from "@app/(website)/(clients)/clientServerActions";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
export type ReservationFormContextProps = {
	setSelectedDishIDsViaCB: React.Dispatch<React.SetStateAction<string[]>>;
	setSelectedDishIDs: React.Dispatch<
		React.SetStateAction<
			{
				subSetName: string;
				dishID: number;
			}[]
		>
	>;
	setPrerequisiteToDialog: React.Dispatch<React.SetStateAction<number>>;
};

export const ReservationFormContext = createContext<
	ReservationFormContextProps | undefined
>(undefined);
export default function ReservationForm({
	session,
}: {
	session: Session | null;
}) {
	const [selectedDishIDs, setSelectedDishIDs] = useState<
		{ subSetName: string; dishID: number }[]
	>([]);
	const [selectedDishIDsViaCB, setSelectedDishIDsViaCB] = useState<string[]>([]);
	const [prerequisiteToDialog, setPrerequisiteToDialog] = useState<number>(1);
	const currentDate = new Date();
	const [date, setDate] = useState<Date | undefined>(addDays(currentDate, 3));
	//Note to self: Date type instead of Numbers, so I can use date comparison methods
	const [month, setMonth] = useState<Date>(currentDate);
	const allDishes = useSWR("rfGetAllDishes", getAllDishes);
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
	return (
		<>
			<ReservationFormContext.Provider
				value={{
					setSelectedDishIDsViaCB,
					setSelectedDishIDs,
					setPrerequisiteToDialog,
				}}>
				<SetPicker />
			</ReservationFormContext.Provider>

			{/* Bottom half */}
			<div className="flex gap-12">
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
						{!session && <p className="mb-4">You are not signed in</p>}
						{allDishes.data &&
							(() => {
								const selectedByCheckBoxes = selectedDishIDsViaCB.map(selectedIDs => {
									const [subSetName, dishID] = selectedIDs.split("_jin_");
									return { subSetName, dishID: parseInt(dishID) };
								});
								const mergedSelectedIDs = selectedDishIDs.concat(selectedByCheckBoxes);
								const dishesByCourse = (() => {
									const allSelectedDishes = allDishes.data.filter(dish =>
										mergedSelectedIDs.map(d => d.dishID).includes(dish.id)
									);
									const dishesByCourses: {
										[key: string]: {
											id: Number;
											name: string;
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
										});
									});
									return dishesByCourses;
								})();
								return (
									<>
										<Button
											disabled={mergedSelectedIDs.length < prerequisiteToDialog}
											onClick={() => {
												if (session?.user) {
													setIsPaymentDialogOpen(true);
												} else {
													signIn();
												}
											}}>
											9:00am | Brgy. Taft, Narciso St., Surigao City
										</Button>
										<PaymentDialog
											dishesByCourse={dishesByCourse}
											open={isPaymentDialogOpen}
											onOpenChange={setIsPaymentDialogOpen}
											selectedMonth={month}
											selectedDate={date}
											currentDate={currentDate}
										/>
									</>
								);
							})()}
						<ScrollBar />
					</ScrollArea>
				</div>
			</div>
		</>
	);
}
