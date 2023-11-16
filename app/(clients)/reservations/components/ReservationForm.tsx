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

export default function ReservationForm() {
	const prerequisiteToDialog = 3;
	const [selected, setSelected] = useState(0);
	type Dish = {
		id: Number;
		name: string;
		isAvailable: boolean;
		price: number;
		category: {
			id: number;
			name: string;
		};
		course: {
			id: number;
			name: string;
		};
	};
	const [selectedDishes, setSelectedDishes] = useState<Dish[]>([]);

	function selectDishes(dish: Dish | undefined) {
		if (dish === undefined) return;

		const existingIndex = selectedDishes.findIndex(
			sDish =>
				sDish.category.id === dish.category.id && sDish.course.id === dish.course.id
		);

		if (existingIndex !== -1) {
			// If category already exists, replace it
			setSelectedDishes(prevItems => {
				const updatedItems = [...prevItems];
				updatedItems[existingIndex] = { ...dish }; // Create a new object for immutability
				return updatedItems;
			});
		} else {
			// If category doesn't exist, add it instead
			setSelectedDishes(prevItems => [...prevItems, { ...dish }]); // Create a new object for immutability
		}
	}

	const currentDate = new Date();
	const [date, setDate] = useState<Date | undefined>(addDays(currentDate, 3));
	//Note to self: Date type instead of Numbers, so I can use date comparison methods
	const [month, setMonth] = useState<Date>(currentDate);
	const [hour, setHour] = useState<number>(currentDate.getHours() % 12 || 12);
	const [minutes, setMinutes] = useState<number>(0);
	const [meridiem, setMeridiem] = useState<"am" | "pm">("am");
	const defaultTimeLinkName = "Set time";
	const [timeLinkName, setTimeLinkName] = useState<string>(defaultTimeLinkName);
	const [numberOfPacks, setNumberOfPacks] = useState<number>(50);
	const [timeUse, setTimeUse] = useState<number>(4);

	const sets = useSWR("getAllSets", getAllSets, {
		revalidateOnReconnect: true,
	});
	const allCategories = useSWR("getAllCategories", getAllCategories, {
		revalidateOnReconnect: true,
	});
	const allCourses = useSWR("getAllCourses", getAllCourses, {
		revalidateOnReconnect: true,
	});

	return (
		<>
			<div className="mb-14 flex justify-between gap-4 rounded-sm border">
				{sets.data && sets.data.length > 1 && (
					<Button
						className="h-full self-center rounded-e-none"
						onClick={() => {
							if (selected > 0) {
								setSelected(selected - 1);
								setSelectedDishes([]);
							}
						}}
						disabled={selected === 0}>
						<ChevronLeft className="h-96" />
					</Button>
				)}
				{sets.data && allCategories.data && (
					<SetCards
						title={sets.data[selected].name}
						subSets={sets.data[selected].subSets}
						allCategories={allCategories.data}
						selected
						selectProducts={selectDishes}></SetCards>
				)}

				{sets.data && sets.data.length > 1 && (
					<Button
						className="h-full self-center rounded-s-none"
						onClick={() => {
							if (sets.data && selected < sets.data.length - 1) {
								setSelected(selected + 1);
								setSelectedDishes([]);
							}
						}}
						disabled={selected === sets.data.length - 1}>
						<ChevronRight className="h-96" />
					</Button>
				)}
			</div>
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
					fixedWeeks></Calendar>
				<div className="flex max-h-[26.425rem] flex-1 flex-col rounded-md border px-4 py-3">
					<h3 className="mb-3 text-lg">{date?.toDateString()} - Vacants</h3>
					<hr className="mb-4" />
					<ScrollArea>
						<Dialog>
							<DialogTrigger asChild>
								<Button disabled={selectedDishes.length < prerequisiteToDialog}>
									9:00am | Brgy. Taft, Narciso St., Surigao City
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
								<Tabs defaultValue="confirmation">
									<TabsContent value="confirmation" className="mt-0 flex flex-col gap-4">
										<DialogHeader className="mb-4">
											<DialogTitle>Confirmation</DialogTitle>
											<DialogDescription>Confirm your details here</DialogDescription>
										</DialogHeader>
										<div className="grid grid-cols-2 gap-9">
											{allCourses.data &&
												allCourses.data.map(course => (
													<ul key={course.id}>
														<span className="text-sm font-bold">{course.name}</span>
														{selectedDishes
															.filter(dish => dish.course.id == course.id)
															.map(dish => (
																<li key={dish.id.toString()}>{dish.name}</li>
															))}
													</ul>
												))}
										</div>
										<div className="grid grid-cols-2 gap-9">
											<span className="text-sm font-bold">Number of packs:</span>
											<Popover>
												<PopoverTrigger asChild>
													<a className="inline cursor-pointer text-primary">
														{numberOfPacks}
													</a>
												</PopoverTrigger>
												<PopoverContent className="w-60 drop-shadow">
													<h5 className="font-bold">Number of packs</h5>
													<p className="text-sm text-muted-foreground">
														Minimum of <strong className="font-bold">50 packs</strong>
													</p>
													<Separator className="my-2"></Separator>
													<div className="flex justify-around text-base">
														<input
															className="w-24"
															type="number"
															min={50}
															value={numberOfPacks.toString()}
															onChange={e => {
																const np = parseInt(e.target.value, 10);
																if (!isNaN(np) && np >= 50) {
																	setNumberOfPacks(np);
																}
															}}
														/>
														<span className="font-bold">Packs</span>
													</div>

													<Separator className="col-span-3 my-2"></Separator>
													<div className="col-span-3 flex justify-end">
														<PopoverClose asChild>
															<Button>Save</Button>
														</PopoverClose>
													</div>
												</PopoverContent>
											</Popover>
										</div>
										<div className="grid grid-cols-2 gap-x-9">
											<div className="order-1 text-sm font-bold">Date and Time</div>
											<span className="order-3">{date?.toDateString()}</span>
											<div className="order-2 row-span-2 grid grid-cols-[1fr_auto_1fr]">
												<div className="text-sm font-bold">Start of event</div>
												<Separator
													orientation="vertical"
													className="row-span-2 mx-4"></Separator>
												<div className="text-sm font-bold">Renting Hours</div>
												<Popover>
													<PopoverTrigger asChild>
														<a className="inline cursor-pointer text-primary">
															{timeLinkName}
														</a>
													</PopoverTrigger>
													<PopoverContent className="w-60 drop-shadow">
														<div className="grid grid-cols-3 gap-2">
															<div className="col-span-3 text-sm font-bold">
																When do you want to start?
															</div>
															<span className="text-xs font-bold">Hour</span>
															<span className="text-xs font-bold">Minute</span>
															<span className="text-xs font-bold">am/pm</span>
															<input
																type="number"
																max={12}
																min={1}
																value={hour.toString()}
																onChange={e => {
																	const numericValue = parseInt(e.target.value, 10);
																	setHour(
																		isNaN(numericValue)
																			? 1
																			: numericValue <= 12 && numericValue > 0
																			? numericValue
																			: 1
																	);
																}}
															/>
															<input
																type="number"
																max={59}
																min={1}
																value={minutes.toString()}
																onChange={e => {
																	const numericValue = parseInt(e.target.value, 10);
																	setMinutes(
																		isNaN(numericValue)
																			? 0
																			: numericValue < 59 && numericValue > 0
																			? numericValue
																			: 0
																	);
																}}
															/>
															<Button
																variant={"outline"}
																className="h-8"
																onClick={() => setMeridiem(meridiem === "am" ? "pm" : "am")}>
																{meridiem}
															</Button>
															<Separator className="col-span-3 my-2"></Separator>
															<div className="col-span-3 flex justify-end">
																<PopoverClose asChild>
																	<Button
																		onClick={() => {
																			const min =
																				minutes < 10
																					? "0".concat(minutes.toString())
																					: minutes.toString();
																			setTimeLinkName(hour + ":" + min + meridiem);
																		}}>
																		Save
																	</Button>
																</PopoverClose>
															</div>
														</div>
													</PopoverContent>
												</Popover>
												<Popover>
													<PopoverTrigger asChild>
														<a className="inline cursor-pointer text-primary">
															{timeUse + " hours"}
														</a>
													</PopoverTrigger>
													<PopoverContent className="w-60 drop-shadow">
														<h5 className="font-bold">Renting Hours</h5>
														<p className="text-sm text-muted-foreground">
															Minimum of <strong className="font-bold">4 hours</strong>
														</p>
														<Separator className="my-2"></Separator>
														<div className="flex justify-around text-base">
															<input
																type="number"
																max={10}
																min={4}
																value={timeUse.toString()}
																onChange={e => {
																	const tu = parseInt(e.target.value, 10);
																	if (!isNaN(tu) && tu >= 4 && tu <= 10) {
																		setTimeUse(tu);
																	}
																}}
															/>
															<span className="font-bold">Hours</span>
														</div>

														<Separator className="col-span-3 my-2"></Separator>
														<div className="col-span-3 flex justify-end">
															<PopoverClose asChild>
																<Button>Save</Button>
															</PopoverClose>
														</div>
													</PopoverContent>
												</Popover>
											</div>
										</div>
										<div>
											<div className="text-sm font-bold">Branch</div>
											<div>Brgy. Taft, Narciso St., Surigao City</div>
										</div>
										<DialogFooter className="mt-4">
											<TabsList>
												<TabsTrigger asChild value="additional" type="button">
													<Button disabled={timeLinkName === defaultTimeLinkName}>
														Next
													</Button>
												</TabsTrigger>
											</TabsList>
										</DialogFooter>
									</TabsContent>
									<TabsContent value="additional" className="mt-0 flex flex-col gap-4">
										<DialogHeader className="mb-4">
											<DialogTitle>Additional Charges</DialogTitle>
										</DialogHeader>
										<div className="flex flex-col gap-y-4">
											{additional_services.map(item => (
												<div key={item.name} className="grid grid-cols-2 gap-x-16">
													<CheckboxWithText
														key={item.name}
														defaultChecked={item.isUsed}
														disabled>
														{item.name}
													</CheckboxWithText>
													<span>₱{item.price.toFixed(2)}</span>
												</div>
											))}
										</div>
										<DialogFooter className="mt-4">
											<TabsList className="flex gap-4 bg-inherit">
												<TabsTrigger asChild value="confirmation" type="button">
													<Button variant={"secondary"}>Back</Button>
												</TabsTrigger>
												<TabsTrigger asChild value="payment" type="button">
													<Button>Next</Button>
												</TabsTrigger>
											</TabsList>
										</DialogFooter>
									</TabsContent>
								</Tabs>
							</DialogContent>
						</Dialog>
						<ScrollBar />
					</ScrollArea>
				</div>
			</div>
		</>
	);
}
