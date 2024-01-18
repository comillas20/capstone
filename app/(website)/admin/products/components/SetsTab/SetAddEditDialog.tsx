import { Button } from "@components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import { useContext, useEffect, useTransition } from "react";
import { mutate } from "swr";
import { createOrUpdateSet } from "../serverActions";
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
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@components/ui/input";
import { toast } from "@components/ui/use-toast";
import {
	PRODUCTS_SETS_KEY,
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";
import { Textarea } from "@components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select";

type SetAddEditDialogProps = {
	editSetData?: {
		id: number;
		name: string;
		description: string | null;
		minimumPerHead: number;
		price: number;
		selectionQuantity: number;
		venueID: number;
	};
} & React.ComponentProps<typeof Dialog>;
export default function SetAddEditDialog({
	editSetData,
	...props
}: SetAddEditDialogProps) {
	const { sets, venues } = useContext(
		ProductPageContext
	) as ProductPageContextProps;
	const [isSaving, startSaving] = useTransition();
	function doesSetExists(name: string, venueID: number) {
		const setInQuestion = sets.find(
			set => set.name === name && set.venue.id === venueID
		);
		return !!setInQuestion;
	}
	const formSchema = z
		.object({
			id: z.number(),
			name: z.string().min(1),
			description: z.string().nullable(),
			minimumPerHead: z.number(),
			price: z.number().gte(1),
			selectionQuantity: z.number(),
			venueID: z
				.number()
				.gte(1, { message: "Please select a venue this set will belong" }),
		})
		.refine(
			// ignore own name in checking duplicate name when editing
			data => {
				const isOwnName = editSetData
					? data.name === editSetData.name && data.venueID === editSetData.venueID
					: false;
				return isOwnName || !doesSetExists(data.name, data.venueID);
			},
			{
				message: "This set name in this venue already exists!",
				path: ["name"], // path of error
			}
		);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: editSetData
			? {
					id: editSetData.id,
					name: editSetData.name,
					description: editSetData.description ?? "",
					minimumPerHead: editSetData.minimumPerHead,
					price: editSetData.price,
					selectionQuantity: editSetData.selectionQuantity,
					venueID: editSetData.venueID,
			  }
			: {
					id: -1,
					name: "",
					description: "",
					minimumPerHead: 50,
					price: 0,
					selectionQuantity: 3,
					venueID: -1,
			  },
	});
	function onSubmit(values: z.infer<typeof formSchema>) {
		if (props.onOpenChange) props.onOpenChange(false);
		startSaving(async () => {
			const submitSet = await createOrUpdateSet(values);

			if (submitSet) {
				toast({
					title: "Success",
					description: editSetData
						? values.name + " is successfully modified!"
						: values.name + " is successfully created!",
					duration: 5000,
				});

				mutate(PRODUCTS_SETS_KEY);
			}
		});
	}
	return (
		<Dialog {...props}>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle>{editSetData ? "Edit" : "Create"}</DialogTitle>
					<DialogDescription>
						{editSetData ? "Edit " + editSetData.name : "Create a new set"}
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
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											value={field.value ?? ""}
											placeholder="Description of the set..."
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 items-end gap-4">
							<FormField
								control={form.control}
								name="minimumPerHead"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Minimum/Head</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={value => field.onChange(parseInt(value.target.value, 10))}
											/>
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
										<FormLabel>Price/Head</FormLabel>
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
						</div>
						<div className="grid grid-cols-2 items-end gap-4">
							<FormField
								control={form.control}
								name="venueID"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Venue</FormLabel>
										<FormControl>
											<Select
												onValueChange={value => field.onChange(parseInt(value))}
												defaultValue={field.value > -1 ? String(field.value) : undefined}>
												<SelectTrigger>
													<SelectValue placeholder="--Select category--" />
												</SelectTrigger>
												<SelectContent>
													{venues.map(venue => (
														<SelectItem key={venue.id} value={String(venue.id)}>
															{venue.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="selectionQuantity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<div className="flex items-center gap-2">
															<span>Select quantity of selection:</span>
															<HelpCircle size={15} className="h-5 w-5 text-primary" />
														</div>
													</TooltipTrigger>
													<TooltipContent>
														<p>
															The required number of dishes the customer can pick in this set
														</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={0}
												{...field}
												onChange={e => field.onChange(parseInt(e.target.value, 10))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-between gap-4">
							<div className="flex flex-1 justify-end gap-4">
								<DialogClose asChild>
									<Button
										variant={"secondary"}
										onClick={() => form.reset()}
										type="button">
										Cancel
									</Button>
								</DialogClose>
								<Button type="submit" disabled={isSaving}>
									Save
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
