import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button, buttonVariants } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { Row } from "@tanstack/react-table";
import { useContext, useEffect, useState, useTransition } from "react";
import { Reservations } from "./Columns";
import useSWR, { useSWRConfig } from "swr";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import { changeStatus, updateReservation } from "../serverActions";
import { toast } from "@components/ui/use-toast";
import {
	ReservationPageContext,
	ReservationPageContextProps,
} from "./ReservationPage";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import {
	getAllServices,
	getAllSets,
	sendSMS,
} from "@app/(website)/serverActionsGlobal";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@components/ui/popover";
import {
	Command,
	CommandInput,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@components/ui/command";
import { cn } from "@lib/utils";
import { CheckboxGroup, CheckboxItem } from "@components/CheckBoxGroup";
import { Input } from "@components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { ScrollArea } from "@components/ui/scroll-area";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@components/ui/table";

interface DataTableRowActionsProps {
	row: Row<Reservations>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
	const { reservationTableDataKey } = useContext(
		ReservationPageContext
	) as ReservationPageContextProps;
	const [isChangingStatus, startChangingStatus] = useTransition();
	const [isDenyOpen, setIsDenyOpen] = useState(false);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const { mutate } = useSWRConfig();
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
					<DropdownMenuItem onSelect={() => setIsDetailsOpen(true)}>
						Details
					</DropdownMenuItem>
					{(row.original.status === "PENDING" ||
						row.original.status === "PARTIAL") && (
						<DropdownMenuItem
							onSelect={() =>
								startChangingStatus(async () => {
									const id = row.original.id;
									const result = await changeStatus(id, "ONGOING");
									if (result) {
										const res = await sendSMS({
											message:
												"Your reservation at Jakelou has been reviewed and accepted. Please keep your transaction number safe and ready when your event starts.",
											recipient: row.original.userPhoneNumber,
										});
										if (res === "success") {
											toast({
												title: "Success",
												description:
													"The selected reservation is successfully accepted and the customer was notified via SMS",
												duration: 5000,
											});
										} else {
											toast({
												title: "Success",
												description:
													"The selected reservation is successfully accepted, but the SMS notification for the customer failed",
												duration: 5000,
											});
										}
										mutate(reservationTableDataKey);
									}
								})
							}
							disabled={isChangingStatus}>
							Accept
						</DropdownMenuItem>
					)}
					<DropdownMenuItem
						onSelect={() => setIsDenyOpen(true)}
						disabled={isChangingStatus}>
						Cancel
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialog open={isDenyOpen} onOpenChange={setIsDenyOpen}>
				<AlertDialogContent>
					<AlertDialogHeader className="mb-4">
						<AlertDialogTitle className="text-destructive">
							Deny reservation
						</AlertDialogTitle>
						<AlertDialogDescription>
							{"Denying " + row.getValue("Customer") + "'s reservation"}
						</AlertDialogDescription>
						<div className="text-destructive">
							This action cannot be undo. Continue?
						</div>
					</AlertDialogHeader>
					<div className="flex justify-end gap-4">
						<AlertDialogCancel
							className={buttonVariants({ variant: "secondary" })}
							type="button">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								startChangingStatus(async () => {
									const id = row.original.id;
									const result = await changeStatus(id, "CANCELLED");
									if (result) {
										const res = await sendSMS({
											message: "Your reservation at Jakelou has been cancelled.",
											recipient: row.original.userPhoneNumber,
										});
										if (res === "success") {
											toast({
												title: "Success",
												description:
													"The selected reservation is successfully cancelled and the customer was notified via SMS",
												duration: 5000,
											});
										} else {
											toast({
												title: "Success",
												description:
													"The selected reservation is successfully cancelled, but the SMS notification for the customer failed",
												duration: 5000,
											});
										}
										mutate(reservationTableDataKey);
									}
								})
							}
							disabled={isChangingStatus}>
							{isChangingStatus && <Loader2 className="mr-2 animate-spin" />}
							Deny
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
			<Details
				key={JSON.stringify(row)}
				open={isDetailsOpen}
				onOpenChange={setIsDetailsOpen}
				row={row}
			/>
		</>
	);
}

type DetailsProps = {
	row: Row<Reservations>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};
export function Details({ row, open, onOpenChange }: DetailsProps) {
	const sets = useSWR("DetailsAllSet", getAllSets);
	const services = useSWR("DetailsAllServices", getAllServices);
	const { reservationTableDataKey } = useContext(
		ReservationPageContext
	) as ReservationPageContextProps;
	const { mutate } = useSWRConfig();
	const [selectedSet, setSelectedSet] = useState<string>(row.original.setName);
	const [selectedDishes, setSelectedDishes] = useState<string[]>(
		row.original.dishes
	);
	const [selectedServices, setSelectedServices] = useState<string[]>(
		row.original.otherServices.map(os => os.name)
	);
	const [additionalFees, setAdditionalFees] = useState<
		{ id: number; name: string; price: number }[]
	>(row.original.additionalFees);
	const [inputValues, setInputValues] = useState<
		{ key: string; value: number }[]
	>([]);
	const currentSet = sets.data?.find(
		set => set.name === selectedSet && set.venue.name === row.original.venue.name
	);
	const [isSaving, startSaving] = useTransition();
	useEffect(() => {
		if (currentSet?.name === row.original.setName) {
			setSelectedDishes(row.original.dishes);
		} else if (currentSet) {
			let randomShit: string[] = [];
			for (let i = 0; i < currentSet.selectionQuantity; i++) {
				randomShit.push("No food selected - ".concat(String(i)));
			}
			setSelectedDishes(randomShit);
		}
	}, [currentSet]);
	if (!sets.data || !services.data) return <div></div>;
	else {
		const availableSets = sets.data.filter(
			set => set.venue.name === row.original.venue.name
		);
		const dishes = currentSet?.subSets
			.flatMap(subSet => subSet.dishes.map(dish => dish))
			.filter(
				dish =>
					dish.isAvailable &&
					!selectedDishes.some(
						selectedDish => selectedDish.toLowerCase() === dish.name.toLowerCase()
					)
			)
			.sort((a, b) => a.category.name.localeCompare(b.category.name));

		// Helper function to check uniqueness based on the 'name' property
		const isUniqueCategory = (value: any, index: number, self: any[]) =>
			self.findIndex(c => c.name === value.name) === index;

		// Filter unique categories using the helper function and Set
		const categories = dishes
			? dishes.map(dish => dish.category).filter(isUniqueCategory)
			: [];

		const handleInputChange = (serviceName: string, inputValue: number) => {
			if (services.data) {
				//get all services that has unit and unitName
				const withUnits = services.data.filter(
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
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-2xl">
					<Tabs className="space-y-8" defaultValue="transactions">
						<DialogHeader>
							<DialogTitle>Details</DialogTitle>
							<DialogDescription>Reservation details</DialogDescription>
						</DialogHeader>
						<TabsContent value="transactions">
							<h3 className="font-bold">Transactions</h3>
							<Table>
								<TableCaption>
									A list of this customer&apos;s transactions.
								</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead className="text-center">Reference No.</TableHead>
										<TableHead className="text-center">Recipient No.</TableHead>
										<TableHead className="text-center">Message</TableHead>
										<TableHead className="text-center">Created At</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{row.original.transactions.map(t => (
										<TableRow key={t.id}>
											<TableCell className="text-center">{t.referenceNumber}</TableCell>
											<TableCell className="text-center">{t.recipientNumber}</TableCell>
											<TableCell className="text-center">
												{t.message ? (
													<Popover>
														<PopoverTrigger
															className={buttonVariants({ variant: "link", size: "sm" })}>
															View
														</PopoverTrigger>
														<PopoverContent>{t.message}</PopoverContent>
													</Popover>
												) : (
													"None"
												)}
											</TableCell>
											<TableCell className="text-center">{t.createdAt}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TabsContent>
						<TabsContent value="dishes">
							{availableSets.length > 0 && currentSet && dishes ? (
								<div className="flex flex-col gap-2">
									<Select value={selectedSet} onValueChange={setSelectedSet}>
										<SelectTrigger>
											<SelectValue placeholder="Set not found" />
										</SelectTrigger>
										<SelectContent>
											{availableSets.map(set => (
												<SelectItem key={set.id} value={set.name}>
													{set.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{selectedDishes.map((dish, index) => (
										<DishPicker
											key={dish}
											selectedDishes={selectedDishes}
											setSelectedDishes={setSelectedDishes}
											dishes={dishes}
											categories={categories}
											triggerName={dish}
											index={index}
										/>
									))}
								</div>
							) : (
								<div>
									<h3 className="font-bold">{row.original.setName}</h3>
									{row.original.dishes.map(dish => (
										<p key={dish}>{dish}</p>
									))}
								</div>
							)}
						</TabsContent>
						<TabsContent value="services" className="space-y-4">
							<h3 className="font-semibold">Additional Fees</h3>
							<div className="flex justify-between px-2">
								<h4 className="text-sm font-bold">Fees</h4>
								<h4 className="text-sm font-bold">Cost</h4>
							</div>
							<ScrollArea>
								<div className="flex flex-col gap-2">
									{/* <div className="flex flex-col gap-y-4">
									{services.data &&
										services.data.some(service => service.unit && service.unitName) && (
											<p className="grid w-full grid-cols-6 items-center gap-4">
												<span className="col-start-6 text-center text-xs font-semibold">
													Units
												</span>
											</p>
										)}
									{services.data && (
										<CheckboxGroup
											className="w-full"
											checkedValues={selectedServices}
											setCheckedValues={setSelectedServices}>
											{services.data.map(service => {
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
								</div> */}
									{additionalFees.length > 0 ? (
										<>
											{additionalFees.map(af => (
												<CreateOrUpdateFees
													additionalFees={additionalFees}
													setAdditionalFees={setAdditionalFees}
													key={af.name}
													data={af}>
													<Button className="flex justify-between gap-4" variant="outline">
														<p className="col-span-3 text-ellipsis text-sm">{af.name}</p>
														<p className="text-ellipsis text-sm">{af.price}</p>
													</Button>
												</CreateOrUpdateFees>
											))}
											<CreateOrUpdateFees
												additionalFees={additionalFees}
												setAdditionalFees={setAdditionalFees}
												key={"new-shit-v2"}>
												<Button
													type="button"
													variant="link"
													size="sm"
													className="flex w-full justify-center">
													<Plus />
												</Button>
											</CreateOrUpdateFees>
										</>
									) : (
										<CreateOrUpdateFees
											additionalFees={additionalFees}
											setAdditionalFees={setAdditionalFees}
											key={"new-shit"}>
											<Button
												type="button"
												variant="link"
												size="sm"
												className="flex w-full justify-center">
												<Plus />
											</Button>
										</CreateOrUpdateFees>
									)}
								</div>
							</ScrollArea>
						</TabsContent>

						<DialogFooter className="flex flex-row sm:justify-between">
							<TabsList>
								<TabsTrigger value="transactions">Transactions</TabsTrigger>
								<TabsTrigger value="dishes">Dishes & Set</TabsTrigger>
								<TabsTrigger value="services">Services</TabsTrigger>
							</TabsList>
							<div className="flex gap-4">
								<DialogClose className={buttonVariants({ variant: "outline" })}>
									Cancel
								</DialogClose>
								<DialogClose
									className={buttonVariants()}
									onClick={() =>
										startSaving(async () => {
											const prevSet = sets.data?.find(
												set =>
													set.name === row.original.setName &&
													set.venue.name === row.original.venue.name
											);
											if (prevSet && currentSet) {
												const prevSetCost = prevSet.price * row.original.packs;
												const prevFeeCost = row.original.additionalFees.reduce(
													(sum, fee) => sum + fee.price,
													0
												);
												const newSetCost = currentSet.price * row.original.packs;
												const newFeeCost = additionalFees.reduce(
													(sum, fee) => sum + fee.price,
													0
												);

												const currentTotalCost = row.original.totalCost;
												const newTotalCost =
													currentTotalCost -
													(prevFeeCost + prevSetCost) +
													(newFeeCost + newSetCost);

												const result = await updateReservation({
													totalCost: newTotalCost,
													dishes: selectedDishes,
													setName: selectedSet,
													id: row.original.id,
												});

												if (result) {
													const res = await sendSMS({
														message:
															"Your reservation got updated, your total balance is now " +
															new Intl.NumberFormat("en-US", {
																style: "currency",
																currency: "PHP",
															}).format(newTotalCost),
														recipient: row.original.userPhoneNumber,
													});
													if (res === "success") {
														toast({
															title: "Success",
															description:
																"The selected reservation is successfully updated and the customer was notified via SMS",
															duration: 5000,
														});
													} else {
														toast({
															title: "Success",
															description:
																"The selected reservation is successfully updated, but the SMS notification for the customer failed",
															duration: 5000,
														});
													}
													mutate(reservationTableDataKey);
												}
											}
										})
									}>
									Save
								</DialogClose>
							</div>
						</DialogFooter>
					</Tabs>
				</DialogContent>
			</Dialog>
		);
	}
}

type DishPickerProps = {
	selectedDishes: string[];
	setSelectedDishes: React.Dispatch<React.SetStateAction<string[]>>;
	dishes: {
		id: number;
		name: string;
		category: {
			id: number;
			name: string;
			courseID: number;
		};
	}[];
	categories: {
		id: number;
		name: string;
	}[];
	triggerName: string;
	index: number;
};
function DishPicker({
	selectedDishes,
	setSelectedDishes,
	dishes,
	categories,
	triggerName,
	index,
}: DishPickerProps) {
	const [open, setOpen] = useState(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" role="combobox" className="justify-between">
					{triggerName}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" side="right">
				<Command>
					<CommandInput placeholder="Search framework..." />
					<CommandList>
						<CommandEmpty>No framework found.</CommandEmpty>
						{categories.map(category => {
							const filteredDishes = dishes.filter(
								dish => dish.category.name === category.name
							);
							return (
								<CommandGroup key={category.id + category.name} heading={category.name}>
									{filteredDishes.map(dish => (
										<CommandItem
											key={dish.id + dish.name}
											value={dish.name}
											onSelect={currentValue => {
												let Ds = [...selectedDishes];
												// because for some reason, onSelect makes the currentValue have all letters at lowercase
												const c = dishes.find(
													dish => dish.name.toLowerCase() === currentValue.toLowerCase()
												);
												if (!c) return;
												Ds[index] = c.name;
												setSelectedDishes(Ds);
												setOpen(false);
											}}>
											{dish.name}
										</CommandItem>
									))}
								</CommandGroup>
							);
						})}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

type FeeProps = {
	data?: { id: number; name: string; price: number };
	children: React.ReactNode;
	setAdditionalFees: React.Dispatch<
		React.SetStateAction<{ id: number; name: string; price: number }[]>
	>;
	additionalFees: { id: number; name: string; price: number }[];
};

function CreateOrUpdateFees({
	data,
	children,
	additionalFees,
	setAdditionalFees,
}: FeeProps) {
	const formSchema = z.object({
		id: z.number(),
		name: z
			.string()
			.min(1, {
				message: "Cannot be empty",
			})
			.refine(
				d => {
					const result = additionalFees.find(dd => dd.name === d);
					return !result;
				},
				{ message: "This name already exists" }
			),
		price: z.number().min(1, {
			message: "Cannot be empty",
		}),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data ? data.id : -1,
			name: data ? data.name : "",
			price: data ? data.price : 0,
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		const filtered = data
			? additionalFees.filter(af => af.name !== data.name)
			: [];
		setAdditionalFees([...filtered, values]);
	}
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle>{data ? "Update" : "Create"}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											onChange={value => field.onChange(parseFloat(value.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<div className="flex justify-end gap-4">
								<DialogClose
									className={buttonVariants({ variant: "secondary" })}
									onClick={() => form.reset()}
									type="button">
									Cancel
								</DialogClose>
								<Button type="submit">Save</Button>
							</div>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
