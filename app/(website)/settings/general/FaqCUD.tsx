import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
	DialogDescription,
	DialogTitle,
} from "@components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import * as z from "zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
	FAQAlreadyExists,
	createOrUpdateFAQ,
	deleteFAQ,
} from "./serverActions";
import { toast } from "@components/ui/use-toast";
import { useSWRConfig } from "swr";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@components/ui/alert-dialog";

type FAQProps = {
	data?: { id: number; question: string; answer: string };
	children: React.ReactNode;
	SWRKey?: string;
};

export function CreateOrUpdateFAQ({ data, children, SWRKey }: FAQProps) {
	const { mutate } = useSWRConfig();
	const formSchema = z
		.object({
			id: z.number(),
			question: z.string().min(1, {
				message: "Question cannot be empty",
			}),
			answer: z.string().min(1, {
				message: "Answer cannot be empty",
			}),
		})
		.refine(
			async data => {
				const result = await FAQAlreadyExists(data);
				return result ? data.id === result.id : true;
			},
			{ message: "This FAQ already exists", path: ["answer"] }
		);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data ? data.id : -1,
			question: data ? data.question : "",
			answer: data ? data.answer : "",
		},
	});

	const [isSaving, startSaving] = useTransition();
	function onSubmit(values: z.infer<typeof formSchema>) {
		startSaving(async () => {
			const result = await createOrUpdateFAQ(values);
			if (result) {
				toast({
					title: "Success",
					description: data ? "Modified successfully" : "Created successfully",
					duration: 5000,
				});
				if (SWRKey) mutate(SWRKey);
			}
		});
	}
	return (
		<Dialog>
			<DialogTrigger asChild disabled={isSaving}>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle>{data ? "Update" : "Create"}</DialogTitle>
					<DialogDescription>
						FAQ&apos;s will be shown in the home page
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="question"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Question</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="answer"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Answer</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-between">
							{data ? (
								<DeleteDialog data={data} SWRKey={SWRKey}>
									<Button type="button" variant="outline" className="text-destructive">
										Delete
									</Button>
								</DeleteDialog>
							) : (
								<div></div>
							)}
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
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
type DeleteFAQProps = {
	data: {
		id: number;
		question: string;
		answer: string;
	};
	children: React.ReactNode;
	SWRKey?: string | undefined;
};
export function DeleteDialog({ data, children, SWRKey }: DeleteFAQProps) {
	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild disabled={isSaving}>
				{children}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader className="mb-4">
					<AlertDialogTitle className="text-destructive">Delete</AlertDialogTitle>
				</AlertDialogHeader>
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
									const result = await deleteFAQ(data);
									if (result) {
										toast({
											title: "Success",
											description: "Successfully deleted!",
											duration: 5000,
										});
										if (SWRKey) mutate(SWRKey);
									}
								});
							}}
							disabled={isSaving}>
							{isSaving && <Loader2 className="mr-2" />}
							Delete
						</Button>
					</AlertDialogAction>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
