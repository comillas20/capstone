import { Button, buttonVariants } from "@components/ui/button";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTrigger,
	AlertDialogCancel,
	AlertDialogTitle,
	AlertDialogAction,
} from "@components/ui/alert-dialog";
import { Venues } from "./Columns";
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
import { useTransition } from "react";
import { toast } from "@components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@components/ui/dialog";
import { getAllVenues } from "@app/(website)/serverActionsGlobal";
import { PRODUCTS_VENUES_KEY } from "../../products/components/ProductPageProvider";
import { createOrUpdateVenue } from "../serverActions";
type AddEditDialogProps = {
	data?: Venues;
	children: React.ReactNode;
};
export function AddEditDialog({ data, children }: AddEditDialogProps) {
	const formSchema = z.object({
		id: z.number(),
		name: z
			.string()
			.min(1)
			.refine(
				async e =>
					!(await getAllVenues()).find(f => {
						//If user is editing, then exclude the current name in searching for duplicate
						const checker = data
							? f.name !== data?.name && f.name === e
							: f.name === e;
						return checker;
					}),
				{
					message: "This venue already exists!",
				}
			),
		location: z.string(),
		freeHours: z.number().nonnegative(),
		venueCost: z.number().gte(1, { message: "Venue cost cannot be zero" }),
		maxCapacity: z.number().gte(1, { message: "Max capacity cannot be zero" }),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: data
			? {
					id: data.id,
					name: data.name,
					freeHours: data.freeHours,
					venueCost: data.venueCost,
					location: data.location,
					maxCapacity: data.maxCapacity,
			  }
			: {
					id: -1,
					name: "",
					freeHours: 0,
					venueCost: 0,
					location: "",
					maxCapacity: 0,
			  },
	});

	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();
	function onSubmit(values: z.infer<typeof formSchema>) {
		startSaving(async () => {
			const result = await createOrUpdateVenue(values);
			if (result) {
				toast({
					title: "Success",
					description: data
						? "The venue is successfully modified!"
						: "The venue is successfully created!",
					duration: 5000,
				});
				mutate(PRODUCTS_VENUES_KEY);
				mutate("VenuePage");
			}
		});
	}
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle>{data ? "Edit" : "Create"}</DialogTitle>
					<DialogDescription>
						{data ? data.name : "Create a new venue"}
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
						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="freeHours"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Free hours</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={e => field.onChange(parseInt(e.target.value, 10))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="venueCost"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Venue cost/hour</FormLabel>
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
								name="maxCapacity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Max Capacity</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={e => field.onChange(parseInt(e.target.value, 10))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-end gap-4">
							<DialogClose
								className={buttonVariants({ variant: "secondary" })}
								onClick={() => form.reset()}
								type="button">
								Cancel
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
	);
}

// type DeleteDialogProps = {
// 	data: Venues;
// 	children: React.ReactNode;
// } & React.ComponentProps<typeof AlertDialog>;

// export function DeleteDialog({ data, children }: DeleteDialogProps) {
// 	const [isSaving, startSaving] = useTransition();
// 	const { mutate } = useSWRConfig();

// 	return (
// 		<AlertDialog>
// 			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
// 			<AlertDialogContent>
// 				<AlertDialogHeader className="mb-4">
// 					<AlertDialogTitle className="text-destructive">Delete</AlertDialogTitle>
// 					<AlertDialogDescription className="space-x-2">
// 						<span>Deleting</span>
// 						<span>{data.name}</span>
// 					</AlertDialogDescription>
// 					<div className="text-destructive">This action cannot be undo. Delete?</div>
// 					<div className="flex justify-end gap-4">
// 						<AlertDialogCancel
// 							className={buttonVariants({ variant: "secondary" })}
// 							type="button">
// 							Cancel
// 						</AlertDialogCancel>
// 						<AlertDialogAction
// 							className={buttonVariants({ variant: "destructive" })}
// 							type="button"
// 							onClick={() => {
// 								startSaving(async () => {
// 									const result = await deleteVenue(data.id);
// 									if (result) {
// 										toast({
// 											title: "Success",
// 											description: data.name + "is successfully deleted!",
// 											duration: 5000,
// 										});
// 										mutate(PRODUCTS_VENUES_KEY);
// 										mutate("VenuePage");
// 									}
// 								});
// 							}}
// 							disabled={isSaving}>
// 							{isSaving && <Loader2 className="mr-2" />}
// 							Delete
// 						</AlertDialogAction>
// 					</div>
// 				</AlertDialogHeader>
// 			</AlertDialogContent>
// 		</AlertDialog>
// 	);
// }
