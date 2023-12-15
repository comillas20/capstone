"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@components/ui/button";
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
import { Loader2 } from "lucide-react";
import TimePicker from "@components/TimePicker";

type GeneralFormProps = {
	openingTime: Date;
	closingTime: Date;
	minimumCustomerReservationHours: number; //in hours
	maximumCustomerReservationHours: number; //in hours
	defaultMinimumPerHead: number;
	maintainanceDates: Date[];
};

export function GeneralForm({
	openingTime,
	closingTime,
	minimumCustomerReservationHours,
	maximumCustomerReservationHours,
	defaultMinimumPerHead,
	maintainanceDates,
}: GeneralFormProps) {
	const generalFormSchema = z.object({
		openingTime: z.date(),
		closingTime: z.date(),
		minimumCustomerReservationHours: z.number(),
		maximumCustomerReservationHours: z.number(),
		defaultMinimumPerHead: z.number(),
		maintainanceDates: z.date().array(),
	});

	type GeneralFormValues = z.infer<typeof generalFormSchema>;

	const form = useForm<GeneralFormValues>({
		resolver: zodResolver(generalFormSchema),
		defaultValues: {
			openingTime: openingTime,
			closingTime: closingTime,
			minimumCustomerReservationHours: minimumCustomerReservationHours,
			maximumCustomerReservationHours: maximumCustomerReservationHours,
			defaultMinimumPerHead: defaultMinimumPerHead,
			maintainanceDates: maintainanceDates,
		},
	});

	const [isSaving, startSaving] = useTransition();
	function onSubmit(data: GeneralFormValues) {
		startSaving(async () => {
			// save to db
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
								<FormControl className="w-60">
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
								<FormControl className="w-60">
									<TimePicker time={field.value} onTimeChange={field.onChange} />
								</FormControl>
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
				<FormField
					control={form.control}
					name="defaultMinimumPerHead"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Minimum per head</FormLabel>
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
					name="maintainanceDates"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Maintainance Dates</FormLabel>
							<FormControl className="w-60"></FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isSaving}>
					{isSaving && <Loader2 className="mr-2 animate-spin" />}
					Save Changes
				</Button>
			</form>
		</Form>
	);
}
