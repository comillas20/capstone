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
import { DropdownMenu } from "@components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";

export default function ReservationForm() {
	const [selected, setSelected] = useState(0);
	type Items = { category: string; course: string; dish: string };
	const [selectedItems, setSelectedItems] = useState<Items[]>([]);

	function selectItems(category: string, course: string, dish: string) {
		setSelectedItems(prevItems => [
			...prevItems,
			{ category: category, course: course, dish: dish },
		]);
	}
	const currentDate = new Date();
	const [date, setDate] = useState<Date | undefined>(addDays(currentDate, 3));
	const [month, setMonth] = useState<Date>(currentDate);

	return (
		<>
			<div className="mb-14 flex justify-between gap-4 rounded-sm border">
				{sets.length > 1 && (
					<Button
						className="h-full self-center rounded-e-none"
						onClick={() => {
							if (selected > 0) {
								setSelected(selected - 1);
								setSelectedItems([]);
							}
						}}
						disabled={selected === 0}>
						<ChevronLeft className="h-96" />
					</Button>
				)}
				<SetCards
					title={sets[selected].name}
					products={sets[selected].products}
					selected
					selectProducts={selectItems}></SetCards>
				{sets.length > 1 && (
					<Button
						className="h-full self-center rounded-s-none"
						onClick={() => {
							if (selected < sets.length - 1) {
								setSelected(selected + 1);
								setSelectedItems([]);
							}
						}}
						disabled={selected === sets.length - 1}>
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
								<Button disabled={selectedItems.length < 4}>{date?.getHours()}</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
								<Tabs defaultValue="confirmation">
									<TabsContent value="confirmation" className="mt-0 flex flex-col gap-4">
										<DialogHeader className="mb-4">
											<DialogTitle>Confirmation</DialogTitle>
											<DialogDescription>Confirm your details here</DialogDescription>
										</DialogHeader>
										<div className="grid grid-cols-2 gap-16">
											<ul>
												<span className="text-sm font-bold">Main Dishes</span>
												{selectedItems
													.filter(value => value.course == "Main dish")
													.map(items => (
														<li key={items.category}>{items.dish}</li>
													))}
											</ul>
											<ul>
												<span className="text-sm font-bold">Desserts</span>
												{selectedItems
													.filter(value => value.course == "Dessert")
													.map(items => (
														<li key={items.category}>{items.dish}</li>
													))}
											</ul>
										</div>
										<div>
											<div className="text-sm font-bold">Date and Time</div>
											<div className="grid grid-cols-2 gap-x-16">
												<span>{date?.toDateString()}</span>
												<Popover>
													<PopoverTrigger asChild>
														<a className="cursor-pointer text-primary">Set time</a>
													</PopoverTrigger>
													<PopoverContent className="w-80">
														<div className="grid grid-cols-2 gap-4"></div>
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
													<Button>Next</Button>
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
										<div>
											<div className="text-sm font-bold">Branch</div>
											<div>Brgy. Taft, Narciso St., Surigao City</div>
										</div>
										<DialogFooter className="mt-4">
											<TabsList>
												<TabsTrigger asChild value="confirmation" type="button">
													<Button>Back</Button>
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
