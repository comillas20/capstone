"use client";
import { Button } from "@components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";
import { Separator } from "@components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { PopoverClose } from "@radix-ui/react-popover";
import { useContext, useEffect, useState, useTransition } from "react";
import { Input } from "@components/ui/input";
import TimePicker, { Meridiem } from "@components/TimePicker";
import useSWR from "swr";
import { getAllServices } from "@app/(website)/serverActionsGlobal";
import { CheckboxGroup, CheckboxItem } from "@components/CheckBoxGroup";
import {
	ReservationFormContext,
	ReservationFormContextProps,
} from "./ReservationForm";
import { signIn } from "next-auth/react";
import { Session } from "next-auth";
import { createReservation, getCurrentUser } from "../serverActions";
import { Loader2 } from "lucide-react";
type PaymentDialogProps = {
	selectedDishes: {
		id: number;
		name: string;
		category: {
			course: {
				name: string;
			};
		};
	}[];
	selectedMonth: Date;
	selectedDate: Date | undefined;
	currentDate: Date;
	session: Session;
	setPrice: number;
} & React.ComponentProps<typeof Dialog>;
export default function PaymentDialog({
	selectedDishes,
	selectedMonth,
	selectedDate,
	currentDate,
	session,
	setPrice,
	...props
}: PaymentDialogProps) {
	const defaultTimeLinkName = "Set time";
	const [timeLinkName, setTimeLinkName] = useState<string>(defaultTimeLinkName); // for display, data not important

	const [numberOfPacks, setNumberOfPacks] = useState<number>(50);
	const [timeUse, setTimeUse] = useState<number>(4);
	const [time, setTime] = useState<Date>(new Date()); //24 hour, to store in database
	const allOtherServices = useSWR("getAllServices", getAllServices);
	const currentUser = useSWR(
		"currentUser",
		async () => await getCurrentUser(parseInt(session.user.userID))
	);
	const [selectedServices, setSelectedServices] = useState<string[]>([]);
	const dishesByCourse = (() => {
		const dishesByCourses: {
			[key: string]: {
				id: Number;
				name: string;
			}[];
		} = {};
		selectedDishes.forEach(dish => {
			const key = dish.category.course.name;

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
	useEffect(() => {
		if (allOtherServices.data) {
			const checkedByDefault = allOtherServices.data
				.filter(service => service.isRequired)
				.map(service => service.name);
			setSelectedServices(prev =>
				Array.from(new Set([...prev, ...checkedByDefault]))
			);
		}
	}, [allOtherServices.data]);

	const [isSaving, startSaving] = useTransition();
	return (
		<Dialog {...props}>
			<DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
				<Tabs defaultValue="confirmation" activationMode="manual">
					<TabsContent value="confirmation" className="mt-0 flex flex-col gap-4">
						<DialogHeader>
							<DialogTitle>Confirmation</DialogTitle>
							<DialogDescription>Confirm your details here</DialogDescription>
						</DialogHeader>
						<Separator />
						<div className="flex gap-9">
							{Object.keys(dishesByCourse).map(courseName => {
								const dishes = dishesByCourse[courseName];
								return (
									<ul key={courseName} className="flex-1">
										<span className="text-sm font-bold">{courseName}</span>
										{dishes.map(dish => (
											<li key={dish.id.toString()}>{dish.name}</li>
										))}
									</ul>
								);
							})}
						</div>
						<div className="grid grid-cols-2 gap-9">
							<span className="text-sm font-bold">Number of packs/dish:</span>
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
							<span className="order-3">{selectedDate?.toDateString()}</span>
							<div className="order-2 row-span-2 grid grid-cols-[1fr_auto_1fr]">
								<div className="text-sm font-bold">Start of event</div>
								<Separator orientation="vertical" className="row-span-2 mx-4" />
								<div className="text-sm font-bold">Renting Hours</div>
								<Popover>
									<PopoverTrigger asChild>
										<a className="inline cursor-pointer text-primary">{timeLinkName}</a>
									</PopoverTrigger>
									<PopoverContent className="w-64 drop-shadow">
										<div className="flex flex-col gap-4">
											<div className="text-sm font-bold">
												What time do you want to start?
											</div>
											<TimePicker time={time} onTimeChange={setTime} />
											<Separator className="my-2" />
											<div className="flex justify-end">
												<PopoverClose asChild>
													<Button
														onClick={() => {
															const hours = time.getHours();
															const minutes = time.getMinutes();
															const meridiem: Meridiem = hours > 12 ? "PM" : "AM";
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
							<div className="text-sm font-bold">Location</div>
							<div>Brgy. Taft, Narciso St., Surigao City</div>
						</div>
						<DialogFooter className="mt-4">
							<TabsList className="bg-inherit">
								<TabsTrigger asChild value="additional" type="button">
									<Button disabled={timeLinkName === defaultTimeLinkName}>Next</Button>
								</TabsTrigger>
							</TabsList>
						</DialogFooter>
					</TabsContent>
					<TabsContent value="additional" className="mt-0 flex flex-col gap-4">
						<DialogHeader>
							<DialogTitle>Services</DialogTitle>
							<DialogDescription>Extra services you might want</DialogDescription>
						</DialogHeader>
						<Separator />
						<div className="flex flex-col gap-y-4">
							{allOtherServices.data && (
								<CheckboxGroup
									className="w-full"
									checkedValues={selectedServices}
									setCheckedValues={setSelectedServices}>
									{allOtherServices.data.map(service => {
										const unit = service.unit
											? `/per ${service.unit} ${service.unitName}`
											: "";
										return (
											<CheckboxItem
												key={service.id}
												value={service.name}
												disabled={service.isRequired}>
												<div className="grid w-full grid-cols-5 gap-4">
													<span className="col-span-3">{service.name}</span>
													<span className="col-span-2">
														{new Intl.NumberFormat("en-US", {
															style: "currency",
															currency: "PHP",
														})
															.format(service.price)
															.concat(unit)}
													</span>
												</div>
											</CheckboxItem>
										);
									})}
								</CheckboxGroup>
							)}
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
					<TabsContent value="payment" className="mt-0 flex flex-col gap-4">
						{currentUser.data && (
							<>
								<DialogHeader>
									<DialogTitle>Payment</DialogTitle>
									<DialogDescription>Pay</DialogDescription>
								</DialogHeader>
								<Separator />
								<div>
									<h3 className="text-xl font-bold">{currentUser.data.name}</h3>
									<p className="text-xs text-muted-foreground">Customer</p>
								</div>

								<div>Month: {selectedMonth.getMonth()}</div>
								<div>Event Time: {timeLinkName}</div>
								<div>Time use: {timeUse}</div>
								<div>Services: {JSON.stringify(selectedServices, undefined, " ")}</div>
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
								<DialogFooter className="mt-4 flex gap-4">
									<TabsList className="bg-inherit">
										<TabsTrigger asChild value="additional" type="button">
											<Button variant={"secondary"}>Back</Button>
										</TabsTrigger>
									</TabsList>
									<Button
										onClick={() => {
											if (session.user && allOtherServices.data) {
												const r: Reservation = {
													email: session.user.email ?? null,
													phoneNumber: session.user.phoneNumber ?? null,
													eventDate: time,
													eventDuration: timeUse,
													orders: selectedDishes, //dishes
													totalPrice:
														setPrice +
														numberOfPacks +
														getSelectedServicesTotalPrice(
															allOtherServices.data,
															selectedServices
														),
													userID: currentUser.data?.id as number,
													userName: currentUser.data?.name as string,
												};
												startSaving(async () => await reserve(r));
											} else {
												signIn();
											}
										}}
										disabled={isSaving}>
										{isSaving && <Loader2 className="mr-2 animate-spin" />}
										Reserve
									</Button>
								</DialogFooter>
							</>
						)}
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
type Reservation = {
	eventDate: Date;
	userID: number;
	userName: string;
	phoneNumber: string | null;
	email: string | null;
	totalPrice: number;
	eventDuration: number;
	orders: {
		id: number;
		name: string;
	}[];
};
async function reserve(reserve: Reservation) {
	// const a = await createReservation(reserve);
	// console.log("END", a);
}

function getSelectedServicesTotalPrice(
	allServicesData: {
		name: string;
		price: number;
	}[],
	selectedServicesNames: string[]
) {
	const selectedServices = allServicesData.filter(service =>
		selectedServicesNames.includes(service.name)
	);
	return selectedServices.reduce(
		(previousValue, currentValue) => previousValue + currentValue.price,
		0
	);
}
