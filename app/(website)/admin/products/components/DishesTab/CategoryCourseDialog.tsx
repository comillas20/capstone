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
import { Button } from "@components/ui/button";
import CCDeleteDialog from "./CCDeleteDialog";
import {
	PRODUCTS_CATEGORIES_KEY,
	PRODUCTS_COURSES_KEY,
	PRODUCTS_DISHES_KEY,
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";
import { createOrUpdateCategoryOrCourse } from "../serverActions";
type CategoryCourseDialogProps = {
	editData?: {
		id: number;
		name: string;
	};
	isCategory: boolean;
	children: React.ReactElement<typeof Button>;
} & React.ComponentProps<typeof Dialog>;

export default function CategoryCourseDialog({
	editData,
	isCategory,
	children,
}: CategoryCourseDialogProps) {
	const { categories, courses } = useContext(
		ProductPageContext
	) as ProductPageContextProps;
	const data = isCategory ? categories : courses;
	const formSchema = z.object({
		id: z.number(),
		name: z
			.string()
			.min(1)
			.refine(e => !data?.find(f => f.name === e), {
				message: isCategory
					? "This category already exists!"
					: "This course type already exists!",
			}),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: editData
			? {
					id: editData.id,
					name: editData.name,
			  }
			: {
					id: -1,
					name: "",
			  },
	});
	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();
	const [isThisOpen, setIsThisOpen] = useState<boolean>();
	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsThisOpen(false);
		startSaving(async () => {
			const submit = await createOrUpdateCategoryOrCourse(values, isCategory);
			if (submit) {
				toast({
					title: "Success",
					description: editData
						? values.name + " is successfully modified!"
						: values.name + " is successfully created!",
					duration: 5000,
				});
				mutate(PRODUCTS_DISHES_KEY);
				mutate(PRODUCTS_COURSES_KEY);
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
					<DialogTitle>
						{editData ? (isCategory ? "Edit Category" : "Edit Course") : "Create"}
					</DialogTitle>
					<DialogDescription>
						{editData
							? "Edit " + editData.name
							: isCategory
							? "Create a new category"
							: "Create a new category"}
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
							{editData && (
								<>
									<Button
										type="button"
										variant={"link"}
										disabled={isSaving}
										onClick={() => setIsDeleteOpen(true)}>
										Delete
									</Button>
									<CCDeleteDialog
										data={editData}
										isCategory={isCategory}
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
