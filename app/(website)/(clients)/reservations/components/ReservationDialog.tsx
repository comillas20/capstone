"use client";
import { Button, buttonVariants } from "@components/ui/button";
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
import {
	getAllServices,
	getGCashNumbers,
} from "@app/(website)/serverActionsGlobal";
import { CheckboxGroup, CheckboxItem } from "@components/CheckBoxGroup";
import {
	ReservationFormContext,
	ReservationFormContextProps,
} from "./ReservationForm";
import { signIn } from "next-auth/react";
import { Session } from "next-auth";
import { createReservation, getCurrentUser } from "../serverActions";
import { AlertTriangle, Loader2, Pencil, X } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { Textarea } from "@components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select";
import { toast } from "@components/ui/use-toast";
import { CheckboxWithText } from "@components/CheckboxWithText";
import { getDaysBySubtraction } from "@lib/date-utils";

type Reservation = {
	setName: string;
	eventDate: Date;
	eventDuration: number;
	eventType: string;
	totalPrice: number;
	dishes: string[];
	transaction: {
		recipientNumber: string;
		referenceNumber: string;
		message: string;
	};
	userID: number;
	venueID: number;
};

type ReservationDialogProps = {
	selectedDishes: {
		id: number;
		name: string;
		category: {
			course: {
				name: string;
			};
		};
	}[];
	session: Session;
	selectedSet: {
		id: number;
		name: string;
		minimumPerHead: number;
		price: number;
	};
} & React.ComponentProps<typeof Dialog>;
export default function ReservationDialog({
	selectedDishes,
	session,
	selectedSet,
	...props
}: ReservationDialogProps) {
	const { date, settings, selectedVenue, currentDate } = useContext(
		ReservationFormContext
	) as ReservationFormContextProps;
	const defaultTimeLinkName = "Set time";
	// for display, other than gatekeeping user, data not so important
	const [timeLinkName, setTimeLinkName] = useState<string>(defaultTimeLinkName);

	const [numberOfPacks, setNumberOfPacks] = useState<number>(
		settings.minPerHead
	);
	const [timeUse, setTimeUse] = useState<number>(
		Math.max(settings.minReservationHours, selectedVenue.freeHours)
	);
	const [time, setTime] = useState<Date>(settings.openingTime); //24 hour, to store in database
	const [eventType, setEventType] = useState<string>();
	const [message, setMessage] = useState<string>("");
	const allOtherServices = useSWR("getAllServices", getAllServices);
	const currentUser = useSWR(
		"currentUser",
		async () => await getCurrentUser(session.user.id)
	);
	const GCashNumbers = useSWR("gCashNumbers", getGCashNumbers);
	const [selectedServices, setSelectedServices] = useState<string[]>([]);
	const [inputValues, setInputValues] = useState<
		{ key: string; value: number }[]
	>([]);

	const handleInputChange = (serviceName: string, inputValue: number) => {
		if (allOtherServices.data) {
			//get all services that has unit and unitName
			const withUnits = allOtherServices.data.filter(
				service => service.unitName && service.unit
			);
			const currentService = withUnits.find(
				service => service.name === serviceName
			);
			if (!currentService) return;
			const unit = currentService.unit as number;
			const isValid = inputValue >= unit;
			const nearestPossibleValue = isValid
				? Math.round(inputValue / unit) * unit
				: unit;
			setInputValues(prev => {
				const updatedValues = [
					...prev.filter(item => item.key !== serviceName),
					{
						key: serviceName,
						value: nearestPossibleValue,
					},
				];
				return updatedValues;
			});
		}
	};
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
			const checkedByDefault = allOtherServices.data.filter(
				service => service.isRequired
			);
			setSelectedServices(prev =>
				Array.from(
					new Set([...prev, ...checkedByDefault.map(service => service.name)])
				)
			);
			const withUnits = allOtherServices.data.filter(
				service => service.unitName && service.unit
			);
			setInputValues(prev =>
				Array.from(
					new Set([
						...prev,
						...withUnits.map(service => ({
							key: service.name as string,
							value: service.unit as number,
						})),
					])
				)
			);
		}
	}, [allOtherServices.data]);

	const [referenceNumber, setReferenceNumber] = useState<string>();
	const [recipientNumber, setRecipientNumber] = useState<string>();
	const [isSaving, startSaving] = useTransition();
	async function initiateReservation(paymentAmount: number) {
		if (
			currentUser.data &&
			allOtherServices.data &&
			date &&
			eventType &&
			recipientNumber &&
			referenceNumber
		) {
			const reservation: Reservation = {
				eventDate: new Date(
					date.getFullYear(),
					date.getMonth(),
					date.getDate(),
					time.getHours(),
					time.getMinutes()
				),
				eventDuration: timeUse,
				eventType: eventType,
				dishes: selectedDishes.map(dish => dish.name),
				totalPrice: paymentAmount,
				setName: selectedSet.name,
				transaction: {
					recipientNumber: recipientNumber,
					referenceNumber: referenceNumber,
					message: message.trim(),
				},
				userID: currentUser.data.id,
				venueID: selectedVenue.id,
			};
			return await createReservation(reservation);
		} else {
			signIn();
		}
	}
	return (
		<Dialog {...props}>
			<DialogContent className="sm:max-w-[425px] md:max-w-[fit-content]">
				{allOtherServices.data && currentUser.data && GCashNumbers.data ? (
					<Tabs defaultValue="reserve">
						<TabsContent
							value="reserve"
							className="mt-0 flex flex-col gap-4  md:max-w-[500px]">
							<DialogHeader>
								<DialogTitle>Reserve</DialogTitle>
								<DialogDescription>Just a bit more...</DialogDescription>
							</DialogHeader>
							<Separator className="mb-4" />
							<div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] grid-rows-2 gap-y-1">
								<span className="flex items-center text-sm font-bold">Packs/dish:</span>
								<Separator orientation="vertical" className="row-span-2 mx-4" />
								<div className="flex items-center gap-2 text-sm font-bold">
									Start of event
									{timeLinkName === defaultTimeLinkName && (
										<AlertTriangle
											className="text-yellow-500 dark:text-yellow-300"
											size={15}
										/>
									)}
								</div>
								<Separator orientation="vertical" className="row-span-2 mx-4" />
								<div className="flex items-center text-sm font-bold">Renting Hours</div>
								<Popover>
									<PopoverTrigger asChild>
										<a className="inline cursor-pointer text-primary">{numberOfPacks}</a>
									</PopoverTrigger>
									<PopoverContent className="w-52 drop-shadow">
										<h5 className="font-bold">Packs</h5>
										<p className="text-sm text-muted-foreground">
											Minimum of{" "}
											<strong className="font-bold">{settings.minPerHead} packs</strong>
										</p>
										<Separator className="my-2" />
										<div className="flex items-center gap-4">
											<Input
												className="w-24"
												type="number"
												min={settings.minPerHead}
												value={numberOfPacks.toString()}
												onChange={e => {
													const np = parseInt(e.target.value, 10);
													if (!isNaN(np)) {
														setNumberOfPacks(np);
													}
												}}
												onBlur={e => {
													const np = parseInt(e.target.value, 10);
													if (!isNaN(np) && np < settings.minPerHead) {
														setNumberOfPacks(settings.minPerHead);
													}
												}}
											/>
											<span className="font-bold">Packs</span>
										</div>
									</PopoverContent>
								</Popover>
								<Popover>
									<PopoverTrigger asChild>
										<a className="inline cursor-pointer text-primary">{timeLinkName}</a>
									</PopoverTrigger>
									<PopoverContent className="w-64 drop-shadow">
										<div className="flex flex-col gap-4">
											<div className="text-sm font-bold">
												What time do you want to start?
											</div>
											<TimePicker
												time={time}
												onTimeChange={setTime}
												minimumTime={settings.openingTime}
												maximumTime={settings.closingTime}
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
								<Popover>
									<PopoverTrigger asChild>
										<a className="inline cursor-pointer text-primary">
											{timeUse + " hours"}
										</a>
									</PopoverTrigger>
									<PopoverContent className="w-52 drop-shadow">
										<h5 className="font-bold">Renting Hours</h5>
										<p className="text-sm text-muted-foreground">
											Minimum of{" "}
											<strong className="font-bold">
												{settings.minReservationHours + " hours"}
											</strong>
										</p>
										<Separator className="my-2" />
										<div className="flex items-center gap-4">
											<Input
												className="w-24"
												type="number"
												max={settings.maxReservationHours}
												min={settings.minReservationHours}
												value={timeUse.toString()}
												onChange={e => {
													const tu = parseInt(e.target.value, 10);
													setTimeUse(tu);
												}}
												onBlur={e => {
													const tu = parseInt(e.target.value, 10);
													if (
														!isNaN(tu) &&
														(tu < settings.minReservationHours ||
															tu > settings.maxReservationHours)
													) {
														setTimeUse(settings.minReservationHours);
													}
												}}
											/>
											<span className="font-bold">Hours</span>
										</div>
									</PopoverContent>
								</Popover>
							</div>
							{allOtherServices.data && allOtherServices.data.length > 0 && (
								<div className="space-y-1.5">
									<h3 className="text-sm font-bold">Additional services</h3>
									<p className="text-xs text-muted-foreground">
										Prices are subject to change without prior notice
									</p>
									<Separator />
								</div>
							)}

							<div className="flex flex-col gap-y-4">
								{allOtherServices.data &&
									allOtherServices.data.some(
										service => service.unit && service.unitName
									) && (
										<p className="grid w-full grid-cols-6 items-center gap-4">
											<span className="col-start-6 text-center text-xs font-semibold">
												Units
											</span>
										</p>
									)}
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
													<div className="grid w-full grid-cols-6 items-center gap-4">
														<span className="col-span-3">{service.name}</span>
														<span className="col-span-2">
															{new Intl.NumberFormat("en-US", {
																style: "currency",
																currency: "PHP",
															})
																.format(service.price)
																.concat(unit)}
														</span>
														{service.unit && (
															<Input
																type="number"
																disabled={
																	service.isRequired || !selectedServices.includes(service.name)
																}
																min={service.unit ?? 0}
																onChange={e => {
																	if (!e.target.value || isNaN(parseInt(e.target.value, 10)))
																		e.target.value = "0";
																	setInputValues(prev => {
																		const updatedValues = [
																			...prev.filter(item => item.key !== service.name),
																			{ key: service.name, value: parseInt(e.target.value, 10) },
																		];
																		return updatedValues;
																	});
																}}
																onBlur={e => {
																	handleInputChange(service.name, parseInt(e.target.value, 10));
																}}
																value={(() => {
																	const currentObject = inputValues.find(
																		obj => obj.key === service.name
																	);
																	const currentValue = currentObject
																		? currentObject.value
																		: null;
																	// we hiding leading zeroes lmao
																	const zero = currentValue == 0 ? "" : currentValue;
																	return zero ?? service.unit;
																})()}
																step={3}
															/>
														)}
													</div>
												</CheckboxItem>
											);
										})}
									</CheckboxGroup>
								)}
							</div>
							<div className="grid grid-cols-2 items-start gap-2">
								<div className="space-y-2">
									<h3 className="text-sm font-bold">Venue</h3>
									<p>{`${selectedVenue.name} @ ${selectedVenue.location}`}</p>
								</div>
								<div className="space-y-2">
									<h3 className="flex items-center gap-2 text-sm font-bold">
										Event type
										{!eventType && (
											<AlertTriangle
												className="text-yellow-500 dark:text-yellow-300"
												size={15}
											/>
										)}
									</h3>
									<Select value={eventType} onValueChange={setEventType}>
										<SelectTrigger>
											<SelectValue placeholder="What kind of event is this?" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="birthday">Birthday</SelectItem>
											<SelectItem value="marriage">Marriage</SelectItem>
											<SelectItem value="baptism">Baptism</SelectItem>
											<SelectItem value="seminar">Seminar</SelectItem>
											<SelectItem value="others">Others</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<AlertDialog>
								<AlertDialogTrigger className="text-left">
									<div className="group space-y-2">
										<h3 className="text-sm font-bold group-hover:text-primary">
											Message (Optional) <Pencil className="inline" size={15} />
										</h3>
										<p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
											{message}
										</p>
									</div>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Message</AlertDialogTitle>
										<AlertDialogDescription>
											Special requests, or anything goes here. (Prices may
											increase/decrease based of said requests and is subjected to the
											manager&apos;s review)
										</AlertDialogDescription>
									</AlertDialogHeader>
									<Textarea value={message} onChange={e => setMessage(e.target.value)} />
									<AlertDialogFooter>
										<AlertDialogCancel>Close</AlertDialogCancel>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
							<Separator />
							<DialogFooter className="mt-4">
								<TabsList className="bg-inherit">
									<TabsTrigger
										className={buttonVariants()}
										value="details"
										type="button"
										disabled={timeLinkName === defaultTimeLinkName || !eventType}>
										Next
									</TabsTrigger>
								</TabsList>
							</DialogFooter>
						</TabsContent>
						{allOtherServices.data &&
							currentUser.data &&
							(() => {
								const totalSetPrice = selectedSet.price * numberOfPacks;
								const totalServicesPrice =
									selectedServices.length !== 0
										? getSelectedServicesTotalPrice(
												allOtherServices.data,
												selectedServices,
												inputValues
										  )
										: 0;
								const totalRentingPrice =
									timeUse > selectedVenue.freeHours
										? (timeUse - selectedVenue.freeHours) * selectedVenue.venueCost
										: 0;
								const totalCost =
									totalSetPrice + totalServicesPrice + totalRentingPrice;
								return (
									<>
										<TabsContent
											value="details"
											className="mt-0 flex flex-col gap-4 md:max-w-[600px]">
											<DialogHeader>
												<DialogTitle>Details</DialogTitle>
												<DialogDescription>
													Please confirm your reservation
												</DialogDescription>
											</DialogHeader>
											<Separator />
											<div>
												<h3 className="text-xl font-bold">{currentUser.data.name}</h3>
												<p className="text-xs text-muted-foreground">Customer</p>
											</div>
											<div className="grid grid-cols-4 items-center gap-4 lg:grid-cols-6">
												<div className="col-span-3 flex items-center space-x-2 lg:col-span-5">
													<Popover>
														<PopoverTrigger className="flex justify-start">
															<span className="text-primary">{selectedSet.name}</span>
														</PopoverTrigger>
														<PopoverContent>
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
														</PopoverContent>
													</Popover>
													<span>set</span>
													<X className="inline" size={15} />
													<span>{numberOfPacks} packs</span>
												</div>
												<div className="text-right">
													{new Intl.NumberFormat("en-US", {
														style: "currency",
														currency: "PHP",
													}).format(totalSetPrice)}
												</div>
											</div>
											{totalServicesPrice > 0 && (
												<div className="grid grid-cols-6 items-center gap-4">
													<div className="col-span-5">Additional Services</div>
													<div className="text-right">
														{new Intl.NumberFormat("en-US", {
															style: "currency",
															currency: "PHP",
														}).format(totalServicesPrice)}
													</div>
												</div>
											)}
											{totalRentingPrice > 0 && (
												<div className="grid grid-cols-6 items-center gap-4">
													<div className="col-span-5 flex items-center space-x-2">
														Rent hours of the venue
													</div>
													<div className="text-right">
														{new Intl.NumberFormat("en-US", {
															style: "currency",
															currency: "PHP",
														}).format(totalRentingPrice)}
													</div>
												</div>
											)}
											<Separator />
											<div className="grid grid-cols-6 items-center gap-4">
												<div className="col-span-5 flex items-center space-x-2 font-bold">
													Total
												</div>
												<div className="text-right">
													{new Intl.NumberFormat("en-US", {
														style: "currency",
														currency: "PHP",
													}).format(totalSetPrice + totalServicesPrice + totalRentingPrice)}
												</div>
											</div>
											<DialogFooter>
												<TabsList className="mt-4 flex gap-4 bg-inherit p-0">
													<TabsTrigger
														className={buttonVariants({ variant: "secondary" })}
														value="reserve"
														type="button">
														Back
													</TabsTrigger>
													<TabsTrigger
														className={buttonVariants()}
														value="payment"
														type="button">
														Next
													</TabsTrigger>
												</TabsList>
											</DialogFooter>
										</TabsContent>
										<TabsContent
											value="payment"
											className="mt-0 flex flex-col gap-4 md:max-w-[600px]">
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
													).format(totalCost * 0.2)}) or full payment to any
													G-Cash number listed below:`}
												</p>
												<div className="grid grid-cols-3 gap-2">
													<div className="col-span-2 space-y-2">
														{GCashNumbers.data.map(gcash => (
															<div key={gcash.id} className="flex justify-between">
																<span>{gcash.name}</span>
																<span>{gcash.phoneNumber}</span>
																{/* {` — $`} */}
															</div>
														))}
													</div>
												</div>
												<p>
													The admin will review your reservation before it gets accepted
												</p>
												{date && getDaysBySubtraction(date, currentDate) === 3 && (
													<p className="font-semibold text-destructive">
														As there are only three (3) days left, it is required that you pay
														the full amount.
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
											<p className="font-semibold">
												*The reference number will be your ticket, please do screenshot your
												transaction details after paying for quick identification at the
												chosen venue
											</p>

											<DialogFooter className="mt-4 flex gap-4">
												<TabsList className="bg-inherit p-0">
													<TabsTrigger
														className={buttonVariants({ variant: "secondary" })}
														value="details"
														type="button">
														Back
													</TabsTrigger>
												</TabsList>
												<TermsOfPayment
													onClick={() => {
														startSaving(async () => {
															const result = await initiateReservation(totalCost);
															if (result) {
																toast({
																	title: "Success",
																	description: "The reservation is now sent to admin to check",
																	duration: 5000,
																});
															}
															// if (result) {
															// 	window.open(result.data.attributes.checkout_url, "_blank");
															// } else console.log("Error at ReservationDialog: ", result);
														});
													}}
													disableTrigger={!recipientNumber || !referenceNumber || isSaving}
													disabled={isSaving}>
													{isSaving && <Loader2 className="mr-2 animate-spin" />}Reserve
												</TermsOfPayment>
											</DialogFooter>
										</TabsContent>
									</>
								);
							})()}
					</Tabs>
				) : (
					<div className="flex gap-2">
						<Loader2 className="animate-spin" />
						<span>Loading...</span>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

type ToS = {
	disableTrigger: boolean;
} & React.ComponentProps<typeof AlertDialogAction>;
export function TermsOfPayment({ disableTrigger, ...props }: ToS) {
	const [isChecked, setIsChecked] = useState<boolean | "indeterminate">(false);
	return (
		<AlertDialog>
			<AlertDialogTrigger className={buttonVariants()} disabled={disableTrigger}>
				Reserve
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader className="text-base font-bold">
					<AlertDialogTitle className="text-xl">Terms of payment</AlertDialogTitle>
				</AlertDialogHeader>
				<div className="space-y-4">
					<p>
						<span className="mr-1.5 text-sm">
							Down payment for reservation of the venue
						</span>
						<span className="text-sm text-destructive">
							(Non refundable and non-consumable once you cancel your booking)
						</span>
					</p>
					<p className="text-sm">
						Full payment of your booking should be three (3) days before your function
					</p>
					<div className="flex items-center space-x-2">
						<CheckboxWithText
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							checked={isChecked}
							onCheckedChange={setIsChecked}>
							Accept terms and conditions
						</CheckboxWithText>
					</div>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<DialogClose asChild>
						<AlertDialogAction {...props} disabled={!isChecked}>
							{props.children}
						</AlertDialogAction>
					</DialogClose>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function getSelectedServicesTotalPrice(
	allServicesData: {
		name: string;
		price: number;
		unit: number | null;
	}[],
	selectedServicesNames: string[],
	quantity: {
		key: string;
		value: number;
	}[]
) {
	const selectedServices = allServicesData.filter(service =>
		selectedServicesNames.includes(service.name)
	);
	const selectedServicesWithQuantity = selectedServices.map(service => ({
		...service,
		unit: service.unit ?? 1,
		quantity: quantity.find(q => q.key === service.name)?.value,
	}));
	return selectedServicesWithQuantity.reduce(
		(previousValue, currentValue) =>
			previousValue +
			(currentValue.price / currentValue.unit) *
				(currentValue.quantity ? currentValue.quantity : 1),
		0
	);
}
