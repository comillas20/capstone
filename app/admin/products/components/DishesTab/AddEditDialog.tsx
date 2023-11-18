import { Button } from "@components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
} from "@components/ui/dialog";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { Dishes } from "./Columns";
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
import useSWR, { useSWRConfig } from "swr";
import {
	getAllCategories,
	getAllCourses,
	editDish,
	createDish,
	getAllDishes,
} from "../serverActions";
import { isAvailable as iaEnum } from "../../page";
import { useTransition } from "react";
import { toast } from "@components/ui/use-toast";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { TriangleDownIcon } from "@radix-ui/react-icons";

type AddEditDialogProps = {
	data?: Dishes;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
} & React.ComponentProps<typeof Dialog>;
export default function AddEditDialog({
	data,
	open,
	onOpenChange,
}: AddEditDialogProps) {
	const allCategories = useSWR("aedGetAllCategories", getAllCategories, {
		revalidateOnReconnect: true,
	});

	const allCourses = useSWR("aedGetAllCourses", getAllCourses, {
		revalidateOnReconnect: true,
	});
	const allDishes = useSWR("aedGetAllDishes", getAllDishes);
	const defaultDDM = "--select--";
	const formSchema = z.object({
		id: z.number(),
		name: z
			.string()
			.min(1)
			.refine(e => !allDishes.data?.find(f => f.name === e), {
				message: "This dish already exists!",
			}),
		categoryID: z
			.string()
			.min(1)
			.refine(e => e !== defaultDDM, {
				message:
					"Please choose a category the dish will fall under (e.g. Pork for Pork Ribs)",
			}),
		courseID: z
			.string()
			.min(1)
			.refine(e => e !== defaultDDM, {
				message:
					"Please choose a course the dish will fall under (e.g. Dessert for Fruit Salad)",
			}),
		isAvailable: z.string(),
		price: z.string().min(1, {
			message: "Please put a price.",
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: data
			? {
					id: data.id,
					name: data.name,
					categoryID: data.categoryID.toString(),
					courseID: data.courseID.toString(),
					isAvailable: data.isAvailable,
					price: data.price.toString(),
			  }
			: {
					id: -1,
					name: "",
					categoryID: defaultDDM,
					courseID: defaultDDM,
					isAvailable: iaEnum.true,
					price: "",
			  },
	});

	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();
	function onSubmit(values: z.infer<typeof formSchema>) {
		onOpenChange(false);
		const orig = {
			id: values.id,
			name: values.name,
			categoryID: parseInt(values.categoryID),
			courseID: parseInt(values.courseID),
			isAvailable: values.isAvailable,
			price: parseFloat(values.price),
		};
		startSaving(async () => {
			const submitDish = data ? await editDish(orig) : await createDish(orig);
			if (submitDish) {
				toast({
					title: "Success",
					description: data
						? "The dish is successfully modified!"
						: "The dish is successfully created!",
					duration: 5000,
				});
				mutate("dpGetAllDishes");
				mutate("aedGetAllCategories");
				mutate("aedGetAllCourses");
				mutate("aedGetAllDishes");
			}
		});
	}
	return (
		!allDishes.isLoading && (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader className="mb-4">
						<DialogTitle>{data ? "Edit" : "Create"}</DialogTitle>
						<DialogDescription>
							{data ? data.name : "Create a new dish"}
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
							<div className="grid grid-cols-2">
								<FormField
									control={form.control}
									name="categoryID"
									render={({ field }) => (
										<FormItem className="space-x-4">
											<FormLabel>Category:</FormLabel>
											<FormControl>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="outline">
															{allCategories.data?.find(
																value => value.id === parseInt(field.value, 10)
															)?.name
																? allCategories.data?.find(
																		value => value.id === parseInt(field.value, 10)
																  )?.name
																: defaultDDM}
															<TriangleDownIcon className="ml-2"></TriangleDownIcon>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent className="w-56">
														<DropdownMenuSeparator />
														<DropdownMenuRadioGroup
															value={field.value}
															onValueChange={field.onChange}>
															{allCategories.data?.map(category => (
																<DropdownMenuRadioItem
																	key={category.id}
																	value={category.id.toString()}>
																	{category.name}
																</DropdownMenuRadioItem>
															))}
														</DropdownMenuRadioGroup>
													</DropdownMenuContent>
												</DropdownMenu>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="courseID"
									render={({ field }) => (
										<FormItem className="space-x-4">
											<FormLabel>Course:</FormLabel>
											<FormControl>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="outline">
															{
																allCourses.data?.find(
																	value => value.id === parseInt(field.value, 10)
																)?.name
																	? allCourses.data?.find(
																			value => value.id === parseInt(field.value, 10)
																	  )?.name
																	: defaultDDM
																//default name for creating
															}
															<TriangleDownIcon className="ml-2" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent className="w-56">
														<DropdownMenuSeparator />
														<DropdownMenuRadioGroup
															value={field.value}
															onValueChange={field.onChange}>
															{allCourses.data?.map(course => (
																<DropdownMenuRadioItem
																	key={course.id}
																	value={course.id.toString()}>
																	{course.name}
																</DropdownMenuRadioItem>
															))}
														</DropdownMenuRadioGroup>
													</DropdownMenuContent>
												</DropdownMenu>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid grid-cols-2">
								<FormField
									control={form.control}
									name="isAvailable"
									render={({ field }) => (
										<FormItem className="space-x-4">
											<FormLabel>Availability:</FormLabel>
											<FormControl>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="outline">
															{field.value}
															<TriangleDownIcon className="ml-2"></TriangleDownIcon>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent className="w-56">
														<DropdownMenuSeparator />
														<DropdownMenuRadioGroup
															value={field.value}
															onValueChange={field.onChange}>
															<DropdownMenuRadioItem value={iaEnum.true}>
																{iaEnum.true}
															</DropdownMenuRadioItem>
															<DropdownMenuRadioItem value={iaEnum.false}>
																{iaEnum.false}
															</DropdownMenuRadioItem>
														</DropdownMenuRadioGroup>
													</DropdownMenuContent>
												</DropdownMenu>
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
											<div className="flex gap-4 pt-2">
												<FormLabel className="flex flex-wrap content-center">
													Price:
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														onChange={field.onChange}
														value={field.value}
													/>
												</FormControl>
											</div>
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
									Submit
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		)
	);
}
