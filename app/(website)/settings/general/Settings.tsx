"use client";

import TimePicker from "@components/TimePicker";
import { Button, buttonVariants } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { Input } from "@components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@lib/utils";
import { useEffect, useState, useTransition } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Settings } from "./page";
import { getFAQs, getSystemSetting } from "@app/(website)/serverActionsGlobal";
import {
	createOrUpdateSystemSetting,
	updateMaintainanceDates,
} from "./serverActions";
import { toast } from "@components/ui/use-toast";
import { Loader2, Plus } from "lucide-react";
import { Separator } from "@components/ui/separator";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@components/ui/accordion";
import { CreateOrUpdateFAQ } from "./FaqCUD";

export function OpeningHour() {
	// data being undefined means its still loading
	// but data being null means its not in the db yet
	const { data, error } = useSWR(
		Settings.openingHour,
		async () => await getSystemSetting(Settings.openingHour)
	);
	const [oTime, setOTime] = useState<Date>(
		new Date("January 20, 2002 00:00:00")
	);
	useEffect(() => {
		if (data) {
			setOTime(data as Date);
		}
	}, [data]);
	const [isSaving, startSaving] = useSettingSaver();
	if (error) return <div>Failed to load</div>;
	else if (data || data === null)
		return (
			<Popover>
				<PopoverTrigger className="text-primary">
					{formatTime(
						data === null ? new Date("January 20, 2002 00:00:00") : (data as Date)
					)}
				</PopoverTrigger>
				<PopoverContent className="space-y-4">
					<div className="flex flex-col gap-4">
						<div className="text-sm font-bold">Starting time</div>
						<TimePicker time={oTime} onTimeChange={setOTime} />
					</div>
					<Separator />
					<div className="flex justify-end">
						<Button
							onClick={() => {
								startSaving(
									{ name: Settings.openingHour, type: "date", value: String(oTime) },
									Settings.openingHour
								);
							}}
							disabled={isSaving}>
							{isSaving && <Loader2 className="mr-2 animate-spin" />}
							Save
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		);
}

export function ClosingHour() {
	// data being undefined means its still loading
	// but data being null means its not in the db yet
	const { data, error } = useSWR(
		Settings.closingHour,
		async () => await getSystemSetting(Settings.closingHour)
	);
	const [cTime, setCTime] = useState<Date>(
		new Date("January 20, 2002 00:00:00")
	);
	useEffect(() => {
		if (data) {
			setCTime(data as Date);
		}
	}, [data]);
	const [isSaving, startSaving] = useSettingSaver();
	if (error) return <div>Failed to load</div>;
	else if (data || data === null)
		return (
			<Popover>
				<PopoverTrigger className="text-primary">
					{formatTime(
						data === null ? new Date("January 20, 2002 00:00:00") : (data as Date)
					)}
				</PopoverTrigger>
				<PopoverContent className="space-y-4">
					<div className="flex flex-col gap-4">
						<div className="text-sm font-bold">Closing time</div>
						<TimePicker time={cTime} onTimeChange={setCTime} />
					</div>
					<Separator />
					<div className="flex justify-end">
						<Button
							onClick={() => {
								startSaving(
									{ name: Settings.closingHour, type: "date", value: String(cTime) },
									Settings.closingHour
								);
							}}
							disabled={isSaving}>
							{isSaving && <Loader2 className="mr-2 animate-spin" />}
							Save
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		);
}

function formatTime(time: Date) {
	const hours = time.getHours();
	const minutes = time.getMinutes();
	const meridiem = hours > 12 ? "PM" : "AM";
	const formattedTime = `${String(hours % 12 || 12).padStart(2, "0")}:${String(
		minutes
	).padStart(2, "0")}${meridiem}`;
	return formattedTime;
}

export function MinimumPerHead() {
	// data being undefined means its still loading
	// but data being null means its not in the db yet
	const { data, error } = useSWR(
		Settings.minPerHead,
		async () => await getSystemSetting(Settings.minPerHead)
	);
	const [mph, setMPH] = useState(50);
	useEffect(() => {
		if (data) {
			setMPH(data as number);
		}
	}, [data]);
	const [isSaving, startSaving] = useSettingSaver();
	if (error) return <div>Failed to load</div>;
	else if (data || data === null)
		return (
			<Popover>
				<PopoverTrigger className="text-primary">
					{data === null ? 50 : (data as number)}
				</PopoverTrigger>
				<PopoverContent className="space-y-4">
					<div>
						<h4>Minimum packs</h4>
						<p className="text-xs text-muted-foreground">
							Minimum packs customers could order
						</p>
					</div>

					<Input
						type="number"
						value={mph}
						onChange={e => setMPH(parseInt(e.target.value))}
					/>
					<div className="flex justify-end">
						<Button
							onClick={() => {
								startSaving(
									{ name: Settings.minPerHead, type: "int", value: String(mph) },
									Settings.minPerHead
								);
							}}
							disabled={isSaving}>
							{isSaving && <Loader2 className="mr-2 animate-spin" />}
							Save
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		);
}

export function ReservationHours() {
	// min.data ad max.data being undefined means its still loading
	// but either data being null means its not in the db yet
	const min = useSWR(
		Settings.minReservationHours,
		async () => await getSystemSetting(Settings.minReservationHours)
	);
	const max = useSWR(
		Settings.maxReservationHours,
		async () => await getSystemSetting(Settings.maxReservationHours)
	);
	const [minHours, setMinHours] = useState<number>(4);
	const [maxHours, setMaxHours] = useState<number>(10);
	useEffect(() => {
		if (min.data && max.data) {
			setMinHours(min.data as number);
			setMaxHours(max.data as number);
		}
	}, [min.data, max.data]);
	const [isSaving, startSaving] = useSettingSaver();
	if (min.error || max.error) return <div>Failed to load</div>;
	else if (min.data !== undefined && max.data !== undefined)
		return (
			<Popover>
				<PopoverTrigger className="text-primary">{`${
					min.data === null ? 4 : (min.data as number)
				} to ${max.data === null ? 10 : (max.data as number)}`}</PopoverTrigger>
				<PopoverContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<h4 className="col-span-2 font-medium">Reservation hours</h4>
						<div className="space-y-2">
							<h5>Minimum</h5>
							<Input
								type="number"
								value={minHours}
								onChange={e => setMinHours(parseInt(e.target.value))}
							/>
						</div>
						<div className="space-y-2">
							<h5>Maximum</h5>
							<Input
								type="number"
								value={maxHours}
								onChange={e => setMaxHours(parseInt(e.target.value))}
							/>
						</div>
					</div>
					<Separator />
					<div className="flex justify-end">
						<Button
							onClick={() => {
								startSaving(
									{
										name: Settings.minReservationHours,
										type: "int",
										value: String(minHours),
									},
									Settings.minReservationHours
								);
								startSaving(
									{
										name: Settings.maxReservationHours,
										type: "int",
										value: String(maxHours),
									},
									Settings.maxReservationHours
								);
							}}
							disabled={isSaving}>
							{isSaving && <Loader2 className="mr-2 animate-spin" />}
							Save
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		);
}

export function ReservationCostPerHour() {
	// data being undefined means its still loading
	// but data being null means its not in the db yet
	const { data, error } = useSWR(
		Settings.reservationCostPerHour,
		async () => await getSystemSetting(Settings.reservationCostPerHour)
	);
	const [cost, setCost] = useState<number>(500);
	useEffect(() => {
		if (data) {
			setCost(data as number);
		}
	}, [data]);
	const [isSaving, startSaving] = useSettingSaver();
	if (error) return <div>Failed to load</div>;
	else if (data || data === null)
		return (
			<Popover>
				<PopoverTrigger className="text-primary">
					{new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "PHP",
					}).format(data === null ? 500 : (data as number))}
				</PopoverTrigger>
				<PopoverContent className="space-y-4">
					<div>
						<h4>Reservation cost/hour</h4>
						<p className="text-xs text-muted-foreground">
							Reservation cost per hour of usage
						</p>
					</div>
					<Input
						type="number"
						value={cost}
						onChange={e => setCost(parseInt(e.target.value))}
					/>
					<div className="flex justify-end">
						<Button
							onClick={() => {
								startSaving(
									{
										name: Settings.reservationCostPerHour,
										type: "float",
										value: String(cost),
									},
									Settings.reservationCostPerHour
								);
							}}
							disabled={isSaving}>
							{isSaving && <Loader2 className="mr-2 animate-spin" />}
							Save
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		);
}

export function MaintainanceDates({
	maintainanceDates,
}: {
	maintainanceDates?: Date[];
}) {
	const [isSaving, startSaving] = useTransition();
	const [dates, setDates] = useState<Date[] | undefined>(maintainanceDates);
	return (
		<Popover>
			<PopoverTrigger className="text-primary">View</PopoverTrigger>
			<PopoverContent className="w-fit space-y-4" side="left">
				<Calendar
					className="p-0"
					mode="multiple"
					onSelect={setDates}
					selected={dates}
					classNames={{
						head_cell:
							"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
						cell: cn(
							buttonVariants({ variant: "ghost" }),
							"h-9 w-9 p-0 font-normal aria-selected:opacity-100"
						),
						day: cn(
							buttonVariants({ variant: "ghost" }),
							"h-8 w-8 p-0 font-normal aria-selected:opacity-100"
						),
					}}
					fixedWeeks
				/>
				<Separator />
				<div className="flex justify-end">
					<Button
						onClick={() =>
							startSaving(async () => {
								const result = dates ? await updateMaintainanceDates(dates) : null;
								toast({
									title: "Success",
									description: result ? "Saved!" : "Failed to save",
									duration: 5000,
								});
							})
						}
						disabled={isSaving}>
						{isSaving && <Loader2 className="mr-2 animate-spin" />}
						Save
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export function FAQ() {
	const SWRKey = "FAQList";
	const { data } = useSWR(SWRKey, async () => getFAQs());
	return (
		data && (
			<Accordion type="single" collapsible>
				<AccordionItem value="item-1" className="border-b-0">
					<AccordionTrigger className="p-0 text-base font-medium hover:no-underline">
						Frequently Asked Questions
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-0.5">
						{data.length > 0 ? (
							<>
								{data.map(faq => (
									<CreateOrUpdateFAQ
										key={String(faq.id).concat(faq.question, faq.answer)}
										data={faq}
										SWRKey={SWRKey}>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="grid grid-cols-2 gap-8 rounded-none">
											<span className="inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-left">
												{faq.question}
											</span>
											<span className="inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-right">
												{faq.answer}
											</span>
										</Button>
									</CreateOrUpdateFAQ>
								))}
								<CreateOrUpdateFAQ
									key={"CREATE-v1-".concat(String(data.length))}
									SWRKey={SWRKey}>
									<Button
										type="button"
										variant="link"
										size="sm"
										className="flex w-full justify-center">
										<Plus />
									</Button>
								</CreateOrUpdateFAQ>
							</>
						) : (
							<CreateOrUpdateFAQ
								key={"CREATE-v2-".concat(String(data.length))}
								SWRKey={SWRKey}>
								<Button
									type="button"
									variant="link"
									size="sm"
									className="flex w-full justify-center">
									<Plus />
								</Button>
							</CreateOrUpdateFAQ>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		)
	);
}

type Setting = {
	name: string;
	type: "int" | "float" | "string" | "date";
	value: string;
};

function useSettingSaver(): [boolean, (setting: Setting, key: string) => void] {
	const { mutate } = useSWRConfig();
	const [isSaving, startSaving] = useTransition();

	const saveSetting = (setting: Setting, key: string) => {
		startSaving(async () => {
			const s = await createOrUpdateSystemSetting(setting);
			if (s) {
				toast({
					title: "Success",
					description: "Saved!",
					duration: 5000,
				});
				mutate(key);
			}
		});
	};

	return [isSaving, saveSetting];
}
