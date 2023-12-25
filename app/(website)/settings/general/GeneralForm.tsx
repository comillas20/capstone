"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button, buttonVariants } from "@components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { toast } from "@components/ui/use-toast";
import { useState, useTransition } from "react";
import { Loader2, X } from "lucide-react";
import TimePicker from "@components/TimePicker";
import { Calendar } from "@components/ui/calendar";
import { ScrollArea } from "@components/ui/scroll-area";
import { cn, convertDateToString } from "@lib/utils";
import { isBefore } from "date-fns";
import { saveSettings } from "./serverActions";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";

type GeneralFormProps = {
	settings: {
		id: number;
		openingTime: Date;
		closingTime: Date;
		minimumCustomerReservationHours: number; //in hours
		maximumCustomerReservationHours: number; //in hours
		defaultMinimumPerHead: number;
		maintainanceDates?: Date[];
		reservationCostPerHour: number;
	} | null;
};

export function GeneralForm({ settings }: GeneralFormProps) {
	const generalFormSchema = z.object({
		id: z.number(),
		openingTime: z.date(),
		closingTime: z.date(),
		minimumCustomerReservationHours: z.number(),
		maximumCustomerReservationHours: z.number(),
		defaultMinimumPerHead: z.number(),
		maintainanceDates: z.date().array().optional(),
		reservationCostPerHour: z.number(),
	});

	type GeneralFormValues = z.infer<typeof generalFormSchema>;

	const form = useForm<GeneralFormValues>({
		resolver: zodResolver(generalFormSchema),
		defaultValues: settings
			? {
					id: settings.id,
					openingTime: settings.openingTime,
					closingTime: settings.closingTime,
					minimumCustomerReservationHours: settings.minimumCustomerReservationHours,
					maximumCustomerReservationHours: settings.maximumCustomerReservationHours,
					defaultMinimumPerHead: settings.defaultMinimumPerHead,
					maintainanceDates: settings.maintainanceDates,
					reservationCostPerHour: settings.reservationCostPerHour,
			  }
			: {
					id: -1,
					openingTime: new Date("January 20, 2002 00:00:00"),
					closingTime: new Date("January 20, 2002 00:00:00"),
					minimumCustomerReservationHours: 4,
					maximumCustomerReservationHours: 10,
					defaultMinimumPerHead: 50,
					reservationCostPerHour: 500,
			  },
	});

	const [isSaving, startSaving] = useTransition();
	function onSubmit(data: GeneralFormValues) {
		startSaving(async () => {
			const md = data.maintainanceDates ?? [];
			const o = { ...data, maintainanceDates: md };
			const ss = await saveSettings(o);
			if (ss) {
				toast({
					title: "Success",
					description: "Changes are saved successfully.",
					duration: 5000,
				});
			} else {
				toast({
					title: "Failed",
					description: "Something went wrong.",
					duration: 5000,
				});
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pl-4">
				<div className="flex items-center justify-between">
					<h4 className="font-medium">Service hours</h4>
					<div className="flex flex-row gap-1.5">
						<FormField
							control={form.control}
							name="openingTime"
							render={({ field }) => (
								<FormItem>
									<FormControl className="w-52">
										<Popover>
											<PopoverTrigger className="font-medium text-primary">
												{formatTime(field.value)}
											</PopoverTrigger>
											<PopoverContent>
												<div className="flex flex-col gap-4">
													<div className="text-sm font-bold">Starting time</div>
													<TimePicker time={field.value} onTimeChange={field.onChange} />
												</div>
											</PopoverContent>
										</Popover>
									</FormControl>
								</FormItem>
							)}
						/>
						<span>to</span>
						<FormField
							control={form.control}
							name="closingTime"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Popover>
											<PopoverTrigger className="font-medium text-primary">
												{formatTime(field.value)}
											</PopoverTrigger>
											<PopoverContent>
												<div className="flex flex-col gap-4">
													<div className="text-sm font-bold">Closing time</div>
													<TimePicker time={field.value} onTimeChange={field.onChange} />
												</div>
											</PopoverContent>
										</Popover>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>
				<FormField
					control={form.control}
					name="maintainanceDates"
					render={({ field }) => (
						<FormItem className="flex items-center justify-between">
							<FormLabel className="text-base font-medium">
								Maintainance Dates
							</FormLabel>
							<FormControl className="flex space-x-4">
								<Popover>
									<PopoverTrigger className="font-medium text-primary">
										View
									</PopoverTrigger>
									<PopoverContent className="w-fit" side="left">
										<Calendar
											className="p-0"
											mode="multiple"
											onSelect={field.onChange}
											selected={field.value}
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
									</PopoverContent>
								</Popover>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="defaultMinimumPerHead"
					render={({ field }) => (
						<FormItem className="flex items-center justify-between">
							<FormLabel className="text-base font-medium">Minimum guests</FormLabel>
							<FormControl>
								<Popover>
									<PopoverTrigger className="font-medium text-primary">
										{field.value}
									</PopoverTrigger>
									<PopoverContent className="space-y-4">
										<div>
											<h4 className="font-bold">Minimum packs</h4>
											<p className="text-xs text-muted-foreground">
												Minimum packs customers could order
											</p>
										</div>

										<Input type="number" {...field} />
									</PopoverContent>
								</Popover>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex items-center justify-between">
					<h4 className="font-medium">Reservation hours</h4>
					<div className="flex flex-row gap-1.5">
						<FormField
							control={form.control}
							name="minimumCustomerReservationHours"
							render={({ field }) => (
								<FormItem>
									<FormControl className="w-52">
										<Popover>
											<PopoverTrigger className="font-medium text-primary">
												{field.value}
											</PopoverTrigger>
											<PopoverContent className="w-fit">
												<div className="flex flex-col gap-4">
													<div className="text-sm font-bold">Minimum</div>
													<Input type="number" {...field} />
												</div>
											</PopoverContent>
										</Popover>
									</FormControl>
								</FormItem>
							)}
						/>
						<span>to</span>
						<FormField
							control={form.control}
							name="maximumCustomerReservationHours"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Popover>
											<PopoverTrigger className="font-medium text-primary">
												{field.value}
											</PopoverTrigger>
											<PopoverContent className="w-fit">
												<div className="flex flex-col gap-4">
													<div className="text-sm font-bold">Maximum</div>
													<Input type="number" {...field} />
												</div>
											</PopoverContent>
										</Popover>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>
				<FormField
					control={form.control}
					name="reservationCostPerHour"
					render={({ field }) => (
						<FormItem className="flex items-center justify-between">
							<FormLabel className="text-base font-medium">
								Reservation cost/hour
							</FormLabel>
							<FormControl>
								<Popover>
									<PopoverTrigger className="font-medium text-primary">
										{new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "PHP",
										}).format(field.value)}
									</PopoverTrigger>
									<PopoverContent className="space-y-4">
										<div>
											<h4 className="font-bold">Reservation cost/hour</h4>
											<p className="text-xs text-muted-foreground">
												Reservation cost per hour of usage
											</p>
										</div>

										<Input type="number" {...field} />
									</PopoverContent>
								</Popover>
							</FormControl>
						</FormItem>
					)}
				/>
				<div className="flex justify-end pt-8">
					<Button type="submit" disabled={isSaving || !form.formState.isDirty}>
						{isSaving && <Loader2 className="mr-2 animate-spin" />}
						Save Changes
					</Button>
				</div>
			</form>
		</Form>
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
