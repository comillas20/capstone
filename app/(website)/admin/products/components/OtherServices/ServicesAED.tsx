import { Button } from "@components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@components/ui/alert-dialog";
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
import { createOrUpadteServices, deleteServices } from "../serverActions";
import { isAvailable as iaEnum, isRequired as irEnum } from "../../page";
import {
	PRODUCTS_SERVICES_KEY,
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";
import { useContext, useTransition } from "react";
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
	children: React.ReactNode;
};
export function AddEditDialog({ data, children }: AddEditDialogProps) {
	const { services } = useContext(ProductPageContext) as ProductPageContextProps;
	const formSchema = z
		.object({
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
			unit: z.number().nullable(),
			unitName: z.string().nullable(),
			price: z.number().gte(1),
			isRequired: z.boolean(),
			isAvailable: z.boolean(),
		})
		.refine(
			data => (data.unit && data.unitName) || (!data.unit && !data.unitName)
		);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: data
			? {
					id: data.id,
					name: data.name,
					unit: data.unit,
					unitName: data.unitName,
					price: data.price,
					isRequired: data.isRequired,
					isAvailable: data.isAvailable,
			  }
			: {
					id: -1,
					name: "",
					unit: null,
					unitName: null,
					price: 0,
					isRequired: false,
					isAvailable: false,
			  },
	});

	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();
	function onSubmit(values: z.infer<typeof formSchema>) {
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
	// useEffect(() => {
	// 	form.reset();
	// 	console.log("resetted!");
	// }, [open]);
	return (
		services && (
			<AlertDialog>
				<AlertDialogTrigger>{children}</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader className="mb-4">
						<AlertDialogTitle>{data ? "Edit" : "Create"}</AlertDialogTitle>
						<AlertDialogDescription>
							{data ? data.name : "Create a new service"}
						</AlertDialogDescription>
					</AlertDialogHeader>
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
															For example, if a service is priced &apos;per hour&apos;,
															&apos;hour&apos; is the unit. If a product is sold &apos;per
															case&apos;, then &apos;case&apos; is the unit.
														</p>
														<p>
															The number inputted here will act as a multiplier. Example values
															are: 1 for &apos;50php per case&apos;, 3 for &apos;70php per 3
															meters, etc.&apos;
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
								<FormField
									control={form.control}
									name="unitName"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="space-x-2">
												<span>Unit name</span>
												<HelpToolTip className="inline" size={15}>
													<div className="w-96 space-y-2">
														<p>Name of the unit</p>
														<p>&apos;case&apos;, &apos;meter&apos; for example.</p>
														<p>
															Leave empty if not applicable to the current service and if the
															Unit field is empty
														</p>
													</div>
												</HelpToolTip>
											</FormLabel>
											<FormControl>
												<Input type="text" {...field} value={field.value ?? ""} />
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
								<AlertDialogCancel asChild>
									<Button
										variant={"secondary"}
										onClick={() => form.reset()}
										type="button">
										Cancel
									</Button>
								</AlertDialogCancel>
								<Button type="submit" disabled={isSaving}>
									{isSaving && <Loader2 className="mr-2 animate-spin" />}
									Save
								</Button>
							</div>
						</form>
					</Form>
				</AlertDialogContent>
			</AlertDialog>
		)
	);
}

type DeleteDialogProps = {
	data: Services[];
	children: React.ReactNode;
} & React.ComponentProps<typeof AlertDialog>;

export function DeleteDialog({ data, children }: DeleteDialogProps) {
	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();

	return (
		<AlertDialog>
			<AlertDialogTrigger>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader className="mb-4">
					<AlertDialogTitle className="text-destructive">Delete</AlertDialogTitle>
					<AlertDialogDescription>
						Deleting{" "}
						{data.length > 1 ? "selected services" : data[0] ? data[0].name : "ERROR"}
					</AlertDialogDescription>
					<div className="text-destructive">This action cannot be undo. Delete?</div>
					<div className="flex justify-end gap-4">
						<AlertDialogCancel asChild>
							<Button variant={"secondary"} type="button">
								Cancel
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Button
								type="button"
								variant={"destructive"}
								onClick={() => {
									startSaving(async () => {
										const ids = data.map(service => service.id);
										const submitDish = await deleteServices(ids);
										if (submitDish) {
											const plural =
												data.length > 1
													? "The selected services are"
													: data[0].name + " is";
											toast({
												title: "Success",
												description: plural + " successfully deleted!",
												duration: 5000,
											});
											mutate(PRODUCTS_SERVICES_KEY);
										}
									});
								}}
								disabled={isSaving}>
								{isSaving && <Loader2 className="mr-2" />}
								Delete
							</Button>
						</AlertDialogAction>
					</div>
				</AlertDialogHeader>
			</AlertDialogContent>
		</AlertDialog>
	);
}
