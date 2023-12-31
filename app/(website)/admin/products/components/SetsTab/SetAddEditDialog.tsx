import { Button } from "@components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import { useEffect, useTransition } from "react";
import { mutate } from "swr";
import { createOrUpdateSet, doesSetExists } from "../serverActions";
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
import { PRODUCTS_SETS_KEY } from "../ProductPageProvider";
import { Textarea } from "@components/ui/textarea";

type SetAddEditDialogProps = {
	editSetData?: {
		id: number;
		name: string;
		description: string | null;
		minimumPerHead: number;
		price: number;
	};
} & React.ComponentProps<typeof Dialog>;
export default function SetAddEditDialog({
	editSetData,
	...props
}: SetAddEditDialogProps) {
	const [isSaving, startSaving] = useTransition();
	const formSchema = z.object({
		id: z.number(),
		name: z
			.string()
			.min(1)
			.refine(
				// ignore own name in checking duplicate name when editing
				async value =>
					editSetData
						? value === editSetData.name || !(await doesSetExists(value))
						: !(await doesSetExists(value)),
				{
					message: "This set name already exists!",
				}
			),
		description: z.string().nullable(),
		minimumPerHead: z.number(),
		price: z.number().gte(1),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: editSetData
			? {
					id: editSetData.id,
					name: editSetData.name,
					description: editSetData.description ?? "",
					minimumPerHead: editSetData.minimumPerHead,
					price: editSetData.price,
			  }
			: {
					id: -1,
					name: "",
					description: "",
					minimumPerHead: 50,
					price: undefined,
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
						<div className="grid grid-cols-2 gap-4">
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
												onChange={value => field.onChange(parseInt(value.target.value))}
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
