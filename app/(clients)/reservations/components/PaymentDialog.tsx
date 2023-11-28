"use client";
import { Button } from "@components/ui/button";
import { sets, additional_services } from "./temp";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";
import { Separator } from "@components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { PopoverClose } from "@radix-ui/react-popover";
import { addDays } from "date-fns";
import { useState } from "react";
import { CheckboxWithText } from "@components/CheckboxWithText";
import { Input } from "@components/ui/input";
type PaymentDialogProps = {
	dishesByCourse: {
		[courseName: string]: {
			id: Number;
			name: string;
			price: number;
		}[];
	};
} & React.ComponentProps<typeof Dialog>;
export default function PaymentDialog({
	dishesByCourse,
	...props
}: PaymentDialogProps) {
	const [numberOfPacks, setNumberOfPacks] = useState<number>(50);
	const currentDate = new Date();
	const [date, setDate] = useState<Date | undefined>(addDays(currentDate, 3));
	//Note to self: Date type instead of Numbers, so I can use date comparison methods
	const [month, setMonth] = useState<Date>(currentDate);
	const [hour, setHour] = useState<number>(currentDate.getHours() % 12 || 12);
	const [minutes, setMinutes] = useState<number>(0);
	const [meridiem, setMeridiem] = useState<"am" | "pm">("am");
	const defaultTimeLinkName = "Set time";
	const [timeLinkName, setTimeLinkName] = useState<string>(defaultTimeLinkName);
	const [timeUse, setTimeUse] = useState<number>(4);
	return (
		<Dialog {...props}>
			<DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
				<Tabs defaultValue="confirmation">
					<TabsContent value="confirmation" className="mt-0 flex flex-col gap-4">
						<DialogHeader className="mb-4">
							<DialogTitle>Confirmation</DialogTitle>
							<DialogDescription>Confirm your details here</DialogDescription>
						</DialogHeader>
						<div className="grid grid-cols-2 gap-9">
							{Object.keys(dishesByCourse).map(courseName => {
								const dishes = dishesByCourse[courseName];
								return (
									<ul key={courseName}>
										<span className="text-sm font-bold">{courseName}</span>
										{dishes.map(dish => (
											<li key={dish.id.toString()}>{dish.name}</li>
										))}
									</ul>
								);
							})}
						</div>
						<div className="grid grid-cols-2 gap-9">
							<span className="text-sm font-bold">Number of packs:</span>
							<Popover>
								<PopoverTrigger asChild>
									<a className="inline cursor-pointer text-primary">{numberOfPacks}</a>
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
										<a className="inline cursor-pointer text-primary">{timeLinkName}</a>
									</PopoverTrigger>
									<PopoverContent className="w-60 drop-shadow">
										<div className="grid grid-cols-3 gap-2">
											<div className="col-span-3 text-sm font-bold">
												When do you want to start?
											</div>
											<span className="text-xs font-bold">Hour</span>
											<span className="text-xs font-bold">Minute</span>
											<span className="text-xs font-bold">am/pm</span>
											<Input
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
											<Input
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
										<div className="flex items-center justify-around gap-2 text-base">
											<Input
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
									<Button disabled={timeLinkName === defaultTimeLinkName}>Next</Button>
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
	);
}
