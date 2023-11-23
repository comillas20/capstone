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
import useSWR, { mutate } from "swr";
import { createSet, editSet, getAllSets } from "../serverActions";
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

export default function SetAddEditDialog({
	editSetNameData,
	...props
}: { editSetNameData?: { id: number; name: string } } & React.ComponentProps<
	typeof Dialog
>) {
	const [isSaving, startSaving] = useTransition();
	const { data } = useSWR("saedGetAllSets", getAllSets, {
		revalidateOnReconnect: true,
	});
	const formSchema = z.object({
		id: z.number(),
		name: z
			.string()
			.min(1)
			.refine(e => !data?.find(f => f.name === e), {
				message: "This set name already exists!",
			}),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: editSetNameData
			? {
					id: editSetNameData.id,
					name: editSetNameData.name,
			  }
			: {
					id: -1,
					name: "",
			  },
	});
	useEffect(() => {
		form.reset({
			id: editSetNameData ? editSetNameData.id : -1,
			name: editSetNameData ? editSetNameData.name : "",
		});
	}, [editSetNameData, form.reset]);
	function onSubmit(values: z.infer<typeof formSchema>) {
		if (props.onOpenChange) props.onOpenChange(false);
		startSaving(async () => {
			const submitSet = editSetNameData
				? await editSet(values)
				: await createSet(values.name);

			if (submitSet) {
				toast({
					title: "Success",
					description: editSetNameData
						? values.name + " is successfully modified!"
						: values.name + " is successfully created!",
					duration: 5000,
				});

				mutate("spGetAllSets");
				mutate("saedGetAllSets");
			}
		});
	}
	return (
		<Dialog {...props}>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle>{editSetNameData ? "Edit" : "Create"}</DialogTitle>
					<DialogDescription>
						{editSetNameData ? "Edit " + editSetNameData.name : "Create a new set"}
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
