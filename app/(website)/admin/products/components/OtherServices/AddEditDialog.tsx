import { Button } from "@components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
} from "@components/ui/dialog";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { Services } from "./Columns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { useSWRConfig } from "swr";
import { createOrUpadteServices } from "../serverActions";
import { isAvailable as iaEnum, isRequired as irEnum } from "../../page";
import {
	PRODUCTS_SERVICES_KEY,
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";
import { useContext, useEffect, useTransition } from "react";
import { toast } from "@components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select";
import HelpToolTip from "@components/HelpTooltip";

type AddEditDialogProps = {
	data?: Services;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
} & React.ComponentProps<typeof Dialog>;
export default function AddEditDialog({
	data,
	open,
	onOpenChange,
}: AddEditDialogProps) {
	const { services } = useContext(ProductPageContext) as ProductPageContextProps;
	const formSchema = z.object({
		id: z.number(),
		name: z
			.string()
			.min(1)
			.refine(
				e =>
					!services?.find(f => {
						//If user is editing, then exclude the current name in searching for duplicate
						const checker = data
							? f.name !== data?.name && f.name === e
							: f.name === e;
						return checker;
					}),
				{
					message: "This service already exists!",
				}
			),
		duration: z.number().nullable(),
		unit: z.number().nullable(),
		price: z.number().gte(1),
		isRequired: z.boolean(),
		isAvailable: z.boolean(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: data
			? {
					id: data.id,
					name: data.name,
					duration: data.duration,
					unit: data.unit,
					price: data.price,
					isRequired: data.isRequired,
					isAvailable: data.isAvailable,
			  }
			: {
					id: -1,
					name: "",
					duration: null,
					unit: null,
					price: 0,
					isRequired: false,
					isAvailable: false,
			  },
	});

	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();
	function onSubmit(values: z.infer<typeof formSchema>) {
		onOpenChange(false);
		startSaving(async () => {
			const submitDish = await createOrUpadteServices(values);
			if (submitDish) {
				toast({
					title: "Success",
					description: data
						? "The service is successfully modified!"
						: "The service is successfully created!",
					duration: 5000,
				});

				mutate(PRODUCTS_SERVICES_KEY);
			}
		});
	}
	useEffect(() => {
		form.reset();
	}, [open]);
	return (
		services && (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader className="mb-4">
						<DialogTitle>{data ? "Edit" : "Create"}</DialogTitle>
						<DialogDescription>
							{data ? data.name : "Create a new service"}
						</DialogDescription>
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
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="duration"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Duration (in hours)</FormLabel>
											<FormControl>
												<Input
													type="number"
													{...field}
													value={field.value ?? ""}
													onChange={e => field.onChange(parseInt(e.target.value))}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="unit"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="space-x-2">
												<span>Unit</span>
												<HelpToolTip className="inline" size={15}>
													<div className="w-96 space-y-2">
														<p>
															Units refer to the quantity or measurement associated with a
															service.
														</p>
														<p>
															For example, if a service is priced 'per hour', 'hour' is the
															unit. If a product is sold 'per case', then 'case' is the unit.
														</p>
														<p>
															The number inputted here will act as a multiplier. Example values
															are: 1 for "50php per case", 3 for "70php per 3 meters, etc."
														</p>
														<p>Leave empty if not applicable to the current service</p>
													</div>
												</HelpToolTip>
											</FormLabel>
											<FormControl>
												<Input
													type="number"
													{...field}
													value={field.value ?? ""}
													onChange={e => field.onChange(parseInt(e.target.value))}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-3 gap-4">
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
													onChange={e => field.onChange(parseFloat(e.target.value))}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="isRequired"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Required</FormLabel>
											<FormControl>
												<Select
													onValueChange={value => field.onChange(value === "true")}
													defaultValue={String(field.value)}>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="true">{irEnum.true}</SelectItem>
														<SelectItem value="false">{irEnum.false}</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="isAvailable"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Availability</FormLabel>
											<FormControl>
												<Select
													onValueChange={value => field.onChange(value === "true")}
													defaultValue={String(field.value)}>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="true">{iaEnum.true}</SelectItem>
														<SelectItem value="false">{iaEnum.false}</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="flex justify-end gap-4">
								<DialogClose asChild>
									<Button
										variant={"secondary"}
										onClick={() => form.reset()}
										type="button">
										Cancel
									</Button>
								</DialogClose>
								<Button type="submit" disabled={isSaving}>
									{isSaving && <Loader2 className="mr-2 animate-spin" />}
									Save
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		)
	);
}
