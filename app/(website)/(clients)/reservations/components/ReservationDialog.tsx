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
import { getAllServices } from "@app/(website)/serverActionsGlobal";
import { CheckboxGroup, CheckboxItem } from "@components/CheckBoxGroup";
import {
	ReservationFormContext,
	ReservationFormContextProps,
} from "./ReservationForm";
import { signIn } from "next-auth/react";
import { Session } from "next-auth";
import { createReservation, getCurrentUser } from "../serverActions";
import { Loader2, X } from "lucide-react";
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
	const { currentDate, month, date } = useContext(
		ReservationFormContext
	) as ReservationFormContextProps;
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

	const [isSaving, startSaving] = useTransition();
	return (
		<Dialog {...props}>
			<DialogContent className="sm:max-w-[425px] md:max-w-[fit-content]">
				<Tabs defaultValue="reserve">
					<TabsContent
						value="reserve"
						className="mt-0 flex flex-col gap-4  md:max-w-[500px]">
						<DialogHeader>
							<DialogTitle>Reserve</DialogTitle>
							<DialogDescription>Just a bit more...</DialogDescription>
						</DialogHeader>
						<Separator className="mb-4" />
						<div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] grid-rows-2">
							<span className="text-sm font-bold">Packs/dish:</span>
							<Separator orientation="vertical" className="row-span-2 mx-4" />
							<div className="text-sm font-bold">Start of event</div>
							<Separator orientation="vertical" className="row-span-2 mx-4" />
							<div className="text-sm font-bold">Renting Hours</div>
							<Popover>
								<PopoverTrigger asChild>
									<a className="inline cursor-pointer text-primary">{numberOfPacks}</a>
								</PopoverTrigger>
								<PopoverContent className="w-52 drop-shadow">
									<h5 className="font-bold">Packs</h5>
									<p className="text-sm text-muted-foreground">
										Minimum of <strong className="font-bold">50 packs</strong>
									</p>
									<Separator className="my-2"></Separator>
									<div className="flex items-center gap-4">
										<Input
											className="w-24"
											type="number"
											min={50}
											value={numberOfPacks.toString()}
											onChange={e => {
												const np = parseInt(e.target.value, 10);
												if (!isNaN(np)) {
													setNumberOfPacks(np);
												}
											}}
											onBlur={e => {
												const np = parseInt(e.target.value, 10);
												if (!isNaN(np) && np < 50) {
													setNumberOfPacks(50);
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
								<PopoverContent className="w-52 drop-shadow">
									<h5 className="font-bold">Renting Hours</h5>
									<p className="text-sm text-muted-foreground">
										Minimum of <strong className="font-bold">4 hours</strong>
									</p>
									<Separator className="my-2"></Separator>
									<div className="flex items-center gap-4">
										<Input
											className="w-24"
											type="number"
											max={10}
											min={4}
											value={timeUse.toString()}
											onChange={e => {
												const tu = parseInt(e.target.value, 10);
												setTimeUse(tu);
											}}
											onBlur={e => {
												const tu = parseInt(e.target.value, 10);
												if (!isNaN(tu) && (tu < 4 || tu > 10)) {
													setTimeUse(4);
												}
											}}
										/>
										<span className="font-bold">Hours</span>
									</div>
								</PopoverContent>
							</Popover>
						</div>
						<div className="space-y-1.5">
							<h3 className="text-sm font-bold">Additional services</h3>
							<p className="text-xs text-muted-foreground">
								Prices are subject to change without prior notice
							</p>
							<Separator />
						</div>
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
																const currentValue = currentObject ? currentObject.value : null;
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
						<div className="space-y-2">
							<h3 className="text-sm font-bold">Location</h3>
							<Separator />
							<p>Brgy. Taft, Narciso St., Surigao City</p>
						</div>
						<DialogFooter className="mt-4">
							<TabsList className="bg-inherit">
								<TabsTrigger asChild value="payment" type="button">
									<Button disabled={timeLinkName === defaultTimeLinkName}>Next</Button>
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
									: null;
							const totalRentingPrice = timeUse * 500;
							return (
								<TabsContent
									value="payment"
									className="mt-0 flex flex-col gap-4 md:max-w-[600px]">
									<DialogHeader>
										<DialogTitle>Payment</DialogTitle>
										<DialogDescription>Pay through G-Cash</DialogDescription>
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
									{totalServicesPrice && (
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
									<Separator />
									<div className="grid grid-cols-6 items-center gap-4">
										<div className="col-span-5 flex items-center space-x-2 font-bold">
											Total
										</div>
										<div className="text-right">
											{new Intl.NumberFormat("en-US", {
												style: "currency",
												currency: "PHP",
											}).format(
												totalSetPrice + (totalServicesPrice ?? 0) + totalRentingPrice
											)}
										</div>
									</div>
									{/* <div>{selectedSet.price}</div>
							<div>
								<div className="text-sm font-bold">Location</div>
								<div>Brgy. Taft, Narciso St., Surigao City</div>
							</div>
							<div>Month: {month.getMonth()}</div>
							<div>Event Time: {timeLinkName}</div>
							<div>Time use: {timeUse}</div>
							<div>Services: {JSON.stringify(selectedServices, undefined, " ")}</div> */}
									<DialogFooter className="mt-4 flex gap-4">
										<TabsList className="bg-inherit p-0">
											<TabsTrigger asChild value="reserve" type="button">
												<Button variant={"secondary"}>Back</Button>
											</TabsTrigger>
										</TabsList>
										<TermsOfPayment
											onClick={() => {
												if (session.user && allOtherServices.data) {
													const r: Reservation = {
														email: session.user.email ?? null,
														phoneNumber: session.user.phoneNumber ?? null,
														eventDate: time,
														eventDuration: timeUse,
														orders: selectedDishes, //dishes
														totalPrice:
															selectedSet.price +
															numberOfPacks +
															getSelectedServicesTotalPrice(
																allOtherServices.data,
																selectedServices,
																inputValues
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
											{isSaving && <Loader2 className="mr-2 animate-spin" />}I agree &
											reserve
										</TermsOfPayment>
									</DialogFooter>
								</TabsContent>
							);
						})()}
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}

export function TermsOfPayment(
	props: React.ComponentProps<typeof AlertDialogAction>
) {
	return (
		<AlertDialog>
			<AlertDialogTrigger className={buttonVariants()}>
				Continue
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Terms of payment</AlertDialogTitle>
					<AlertDialogDescription className="text-base font-bold">
						<span className="mr-1.5">Down payment for reservation of the venue</span>
						<span className="text-destructive">
							(Non refundable and non-consumable once you cancel your booking)
						</span>
						<p>
							Full payment of your booking should be three (3) days before your
							function
						</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction {...props}>{props.children}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
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
