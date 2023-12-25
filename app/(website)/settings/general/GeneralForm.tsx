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
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-2 gap-4">
					<h4 className="col-span-2 font-medium">Service hours</h4>
					<FormField
						control={form.control}
						name="openingTime"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Opening time</FormLabel>
								<FormControl className="w-52">
									<TimePicker time={field.value} onTimeChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="closingTime"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Closing time</FormLabel>
								<FormControl className="w-52">
									<TimePicker time={field.value} onTimeChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="maintainanceDates"
						render={({ field }) => (
							<FormItem className="col-span-2">
								<FormLabel>Maintainance Dates</FormLabel>
								<div className="flex gap-4">
									<FormControl className="flex space-x-4">
										<Calendar
											className="pl-0"
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
									</FormControl>
									<ScrollArea className="h-[350px] flex-1 p-4">
										<div className="flex flex-col space-y-2">
											{field.value
												?.sort((a, b) => (isBefore(a, b) ? -1 : 1))
												.map((date, index) => (
													<div
														key={index}
														className="flex w-full items-center justify-between rounded-sm border p-2">
														<span>
															{convertDateToString(date, {
																year: true,
																month: true,
																day: true,
															})}
														</span>
														<button
															type="button"
															onClick={() => {
																if (field.value && field.value.length > 0) {
																	const values = field.value.filter(d => d != date);
																	field.onChange(values);
																}
															}}>
															<X />
														</button>
													</div>
												))}
										</div>
									</ScrollArea>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<h4 className="col-span-2 font-medium">Reservation hours</h4>
					<FormField
						control={form.control}
						name="minimumCustomerReservationHours"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Minimum</FormLabel>
								<FormControl className="w-60">
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="maximumCustomerReservationHours"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Maximum</FormLabel>
								<FormControl className="w-60">
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<h4 className="col-span-2 font-medium">Others</h4>
					<FormField
						control={form.control}
						name="defaultMinimumPerHead"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Minimum packs</FormLabel>
								<FormDescription>Minimum packs customers could order</FormDescription>
								<FormControl className="w-60">
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="reservationCostPerHour"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Reservation cost/hour</FormLabel>
								<FormDescription>Reservation cost per hour of usage</FormDescription>
								<FormControl className="w-60">
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit" disabled={isSaving}>
					{isSaving && <Loader2 className="mr-2 animate-spin" />}
					Save Changes
				</Button>
			</form>
		</Form>
	);
}
