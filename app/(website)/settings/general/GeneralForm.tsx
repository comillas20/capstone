"use client";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "@components/ui/dialog";
import { Textarea } from "@components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button, buttonVariants } from "@components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { toast } from "@components/ui/use-toast";
import { useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import TimePicker from "@components/TimePicker";
import { Calendar } from "@components/ui/calendar";
import { cn } from "@lib/utils";
import { saveSettings } from "./serverActions";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@components/ui/accordion";
import { CreateOrUpdateFAQ } from "./FAQDialog";

type GeneralFormProps = {
	settings: {
		id: number;
		openingTime: Date;
		closingTime: Date;
		minimumCustomerReservationHours: number; //in hours
		maximumCustomerReservationHours: number; //in hours
		defaultMinimumPerHead: number;
		reservationCostPerHour: number;
	} | null;
	maintainanceDates?: Date[];
	faq?: {
		id: number;
		question: string;
		answer: string;
	}[];
};

export function GeneralForm({
	settings,
	maintainanceDates,
	faq,
}: GeneralFormProps) {
	const generalFormSchema = z.object({
		id: z.number(),
		openingTime: z.date(),
		closingTime: z.date(),
		minimumCustomerReservationHours: z.number(),
		maximumCustomerReservationHours: z.number(),
		defaultMinimumPerHead: z.number(),
		maintainanceDates: z.date().array().optional(),
		faq: z
			.object({
				id: z.number(),
				question: z.string(),
				answer: z.string(),
			})
			.array()
			.optional(),
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
					maintainanceDates: maintainanceDates,
					faq: faq,
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
			const faq = data.faq ?? [];
			const o = { ...data, maintainanceDates: md, faq: faq };
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
				<Accordion type="single" collapsible>
					<AccordionItem value="item-1" className="border-b-0">
						<FormField
							control={form.control}
							name="faq"
							render={({ field }) => (
								<FormItem className="flex flex-col justify-between">
									<FormLabel>
										<AccordionTrigger className="p-0 text-base font-medium hover:no-underline">
											Frequently Asked Questions
										</AccordionTrigger>
									</FormLabel>
									<FormControl>
										<AccordionContent className="flex flex-col gap-0.5">
											{field.value && field.value.length > 0 ? (
												<>
													{field.value.map(faq => (
														<CreateOrUpdateFAQ
															key={String(faq.id).concat(faq.question)}
															FAQ={faq}
															prevValues={field.value}
															onValueChange={field.onChange}>
															<Button
																type="button"
																variant="ghost"
																size="sm"
																className="flex justify-between gap-8 rounded-none">
																<span className="text-ellipsis">{faq.question}</span>
																<span className="text-ellipsis">{faq.answer}</span>
															</Button>
														</CreateOrUpdateFAQ>
													))}
													<CreateOrUpdateFAQ
														prevValues={field.value}
														onValueChange={field.onChange}>
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
													prevValues={field.value}
													onValueChange={field.onChange}>
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
									</FormControl>
								</FormItem>
							)}
						/>
					</AccordionItem>
				</Accordion>
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
