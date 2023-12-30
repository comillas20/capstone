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
import { useContext, useState, useTransition } from "react";
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
	PRODUCTS_DISHES_KEY,
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";
import { createOrUpdateCategory, deleteCategory } from "../serverActions";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select";
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
		course: {
			id: number;
			name: string;
		};
	};
	children: React.ReactElement<typeof Button>;
} & React.ComponentProps<typeof Dialog>;

export function AddEditDialog({ data, children }: CategoryDialogProps) {
	const { courses, categories } = useContext(
		ProductPageContext
	) as ProductPageContextProps;
	const formSchema = z.object({
		id: z.number(),
		name: z
			.string()
			.min(1, {
				message: "Name is required",
			})
			.refine(
				value =>
					!categories?.find(category => {
						//If user is editing, then exclude the current name in searching for duplicate
						const checker = data
							? category.name !== data?.name && category.name === value
							: category.name === value;
						return checker;
					}),
				{
					message: "This category already exists!",
				}
			),
		courseID: z.number().min(1, {
			message: "Please select a course this food category will fall under.",
		}),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: data
			? {
					id: data.id,
					name: data.name,
					courseID: data.course.id,
			  }
			: {
					id: -1,
					name: "",
					courseID: -1,
			  },
	});
	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();
	const [isThisOpen, setIsThisOpen] = useState<boolean>();
	// useEffect(() => {
	// 	form.reset();
	// }, [isThisOpen]);
	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsThisOpen(false);
		startSaving(async () => {
			const submit = await createOrUpdateCategory(values);
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
					<DialogTitle>{data ? "Edit Category" : "Create"}</DialogTitle>
					<DialogDescription>
						{data ? "Edit " + data.name : "Create a new category"}
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
							name="courseID"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course</FormLabel>
									<FormControl>
										<Select
											onValueChange={value => field.onChange(parseInt(value))}
											defaultValue={field.value === -1 ? undefined : String(field.value)}>
											<SelectTrigger>
												<SelectValue
													placeholder={data ? data.course.name : "--Select course--"}
												/>
											</SelectTrigger>
											<SelectContent>
												{courses.map(course => (
													<SelectItem key={course.id} value={String(course.id)}>
														{course.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
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
						This action deletes all dishes under this category. Continue?
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
								const submitDish = await deleteCategory(data.id);
								if (submitDish) {
									toast({
										title: "Success",
										description: data.name + " is successfully deleted!",
										duration: 5000,
									});
									mutate(PRODUCTS_CATEGORIES_KEY);
									mutate(PRODUCTS_DISHES_KEY);
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
