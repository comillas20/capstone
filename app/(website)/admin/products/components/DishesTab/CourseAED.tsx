import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import { useSWRConfig } from "swr";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState, useTransition } from "react";
import { toast } from "@components/ui/use-toast";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button, buttonVariants } from "@components/ui/button";
import {
	PRODUCTS_CATEGORIES_KEY,
	PRODUCTS_COURSES_KEY,
	PRODUCTS_DISHES_KEY,
	PRODUCTS_SETS_KEY,
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";
import { createOrUpdateCourse, deleteCourse } from "../serverActions";
import { Loader2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogCancel,
} from "@components/ui/alert-dialog";
type CategoryDialogProps = {
	data?: {
		id: number;
		name: string;
	};
	children: React.ReactElement<typeof Button>;
} & React.ComponentProps<typeof Dialog>;

export function AddEditDialog({ data, children }: CategoryDialogProps) {
	const { courses } = useContext(ProductPageContext) as ProductPageContextProps;
	const formSchema = z.object({
		id: z.number(),
		name: z
			.string()
			.min(1, {
				message: "Name is required",
			})
			.refine(
				e =>
					!courses?.find(f => {
						//If user is editing, then exclude the current name in searching for duplicate
						const checker = data
							? f.name !== data?.name && f.name === e
							: f.name === e;
						return checker;
					}),
				{
					message: "This course already exists!",
				}
			),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: data
			? {
					id: data.id,
					name: data.name,
			  }
			: {
					id: -1,
					name: "",
			  },
	});
	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();
	const [isThisOpen, setIsThisOpen] = useState<boolean>();
	useEffect(() => {
		form.reset();
	}, [isThisOpen]);
	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsThisOpen(false);
		startSaving(async () => {
			const submit = await createOrUpdateCourse(values);
			if (submit) {
				toast({
					title: "Success",
					description: data
						? values.name + " is successfully modified!"
						: values.name + " is successfully created!",
					duration: 5000,
				});
				mutate(PRODUCTS_DISHES_KEY);
				mutate(PRODUCTS_CATEGORIES_KEY);
			}
		});
	}
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	return (
		<Dialog open={isThisOpen} onOpenChange={setIsThisOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle>{data ? "Edit Course" : "Create"}</DialogTitle>
					<DialogDescription>
						{data ? "Edit " + data.name : "Create a new course"}
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
							{data && (
								<>
									<Button
										type="button"
										variant={"link"}
										disabled={isSaving}
										onClick={() => setIsDeleteOpen(true)}>
										Delete
									</Button>
									<DeleteDialog
										data={data}
										isCategory={false}
										open={isDeleteOpen}
										onOpenChange={setIsDeleteOpen}
									/>
								</>
							)}

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
									{isSaving && <Loader2 className="mr-2" />}
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

type DeleteDialogProps = {
	data: {
		id: number;
		name: string;
	};
	isCategory: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
} & React.ComponentProps<typeof Dialog>;

export function DeleteDialog({ data, open, onOpenChange }: DeleteDialogProps) {
	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader className="mb-4">
					<AlertDialogTitle className="text-destructive">Delete</AlertDialogTitle>
					<AlertDialogDescription>
						This action deletes all categories (along the dishes under those
						categories) and subsets under this course. Continue?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className={buttonVariants({ variant: "secondary" })}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className={buttonVariants({ variant: "destructive" })}
						onClick={() => {
							onOpenChange(false);
							startSaving(async () => {
								const submitDish = await deleteCourse(data.id);
								if (submitDish) {
									toast({
										title: "Success",
										description: data.name + " is successfully deleted!",
										duration: 5000,
									});
									mutate(PRODUCTS_CATEGORIES_KEY);
									mutate(PRODUCTS_COURSES_KEY);
									mutate(PRODUCTS_SETS_KEY);
								}
							});
						}}
						disabled={isSaving}>
						{isSaving && <Loader2 className="mr-2" />}
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
