import { Button } from "@components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import { useContext, useEffect, useState, useTransition } from "react";
import { mutate } from "swr";
import {
	createOrUpdateSubset,
	isSubSetAlreadyExistsInASet,
} from "../serverActions";
import {
	getAllCourses,
	getAllDishes,
} from "@app/(website)/serverActionsGlobal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@components/ui/use-toast";
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
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@components/ui/scroll-area";
import { Badge } from "@components/ui/badge";
import { Loader2Icon, Plus, X } from "lucide-react";
import SubSetAddDishesByCategory from "./SubSetAddDishesByCategory";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import SubSetDeleteDialog from "./SubSetDeleteDialog";
import SubSetAddDishesByCommand from "./SubSetAddDishesByCommand";
import {
	PRODUCTS_SETS_KEY,
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";

type SubSetAddEditDialogProps = {
	editSubSetData?: {
		id: number;
		name: string;
		dishes: {
			id: number;
			name: string;
		}[];
		course: {
			id: number;
			name: string;
		};
		selectionQuantity: number;
	};
	setID: number;
	children: React.ReactElement<typeof Button>;
};
export default function SubSetAddEditDialog({
	editSubSetData,
	setID,
	children,
	...props
}: SubSetAddEditDialogProps & React.ComponentProps<typeof Dialog>) {
	const [isSaving, startSaving] = useTransition();
	const { dishes, courses } = useContext(
		ProductPageContext
	) as ProductPageContextProps;
	const formSchema = z.object({
		id: z.number(),
		name: z.string().refine(
			async value =>
				// Ignore own name when editing
				editSubSetData
					? value === editSubSetData.name ||
					  !isSubSetAlreadyExistsInASet(setID, value)
					: !isSubSetAlreadyExistsInASet(setID, value),
			{
				message: "This subset name already exists!",
			}
		),
		setID: z.number().min(1),
		dishes: z.array(z.number().min(1)).min(1, {
			message: "Dishes must contain at least 1 elements",
		}),
		courseID: z.string().min(1),
		selectionQuantity: z.number(),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: editSubSetData
			? {
					id: editSubSetData.id,
					name: editSubSetData.name ?? "",
					setID: setID,
					dishes: editSubSetData.dishes.map(dish => dish.id),
					courseID: editSubSetData.course.id.toString(),
					selectionQuantity: editSubSetData.selectionQuantity,
			  }
			: {
					id: -1,
					name: "",
					setID: setID,
					dishes: [],
					courseID: "",
					selectionQuantity: 1,
			  },
	});
	useEffect(() => {
		form.reset({
			id: editSubSetData ? editSubSetData.id : -1,
			name: editSubSetData ? editSubSetData.name : "",
			setID: setID,
			dishes: editSubSetData ? editSubSetData.dishes.map(dish => dish.id) : [],
			courseID: editSubSetData ? editSubSetData.course.id.toString() : "",
			selectionQuantity: editSubSetData ? editSubSetData.selectionQuantity : 1,
		});
	}, [editSubSetData, form.reset]);
	useEffect(() => {
		form.reset();
	}, [props.open]);
	function onSubmit(values: z.infer<typeof formSchema>) {
		const modSelectionQuantity =
			values.selectionQuantity > values.dishes.length
				? values.dishes.length
				: values.selectionQuantity;
		startSaving(async () => {
			const modValues = {
				...values,
				courseID: parseInt(values.courseID),
				selectionQuantity: modSelectionQuantity,
			};
			const submitSubSet = await createOrUpdateSubset(modValues);

			if (submitSubSet) {
				toast({
					title: "Success",
					description: editSubSetData
						? modValues.name + " is successfully modified!"
						: modValues.name + " is successfully created!",
					duration: 5000,
				});

				mutate(PRODUCTS_SETS_KEY);
			}
		});
		setIsThisDialogOpen(false);
	}
	const [isThisDialogOpen, setIsThisDialogOpen] = useState(false);
	const [isOpenDishCommand, setIsOpenDishCommand] = useState(false);
	const [courseFilterDishes, setCourseFilterDishes] = useState<string>();
	return (
		<Dialog open={isThisDialogOpen} onOpenChange={setIsThisDialogOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle>{editSubSetData ? "Edit" : "Create"}</DialogTitle>
					<DialogDescription>
						{editSubSetData ? "Edit subset" : "Create a new subset"}
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
						{dishes && (
							<FormField
								control={form.control}
								name="dishes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Dishes</FormLabel>
										<div className="grid grid-cols-3 grid-rows-3 gap-x-4 gap-y-2">
											<ScrollArea className="col-span-2 row-span-3 border">
												{field.value.map(dish => (
													<Badge
														key={dish}
														className="mb-1 mr-1 cursor-pointer"
														onClick={() => {
															const updatedValue = field.value.filter(id => id !== dish);
															field.onChange(updatedValue);
														}}>
														{(() => {
															const foundDish = dishes?.find(dishData => dishData.id === dish);
															return foundDish ? foundDish.name : "N/A";
														})()}
														<X size={15} className="ml-1" />
													</Badge>
												))}
											</ScrollArea>
											<Button
												type="button"
												variant={"outline"}
												className="border-primary text-primary"
												size={"sm"}
												onClick={() => setIsOpenDishCommand(true)}>
												<Plus size={15} className="mr-2" />
												Dishes
											</Button>
											{dishes && (
												<SubSetAddDishesByCategory
													dishes={dishes}
													onChange={field.onChange}
													value={field.value}
												/>
											)}
											<Button
												type="button"
												variant={"outline"}
												size={"sm"}
												onClick={() => {
													field.onChange([]);
												}}>
												Clear all
											</Button>
										</div>
										<FormControl>
											{dishes && (
												<SubSetAddDishesByCommand
													dishes={dishes}
													value={field.value}
													onChange={field.onChange}
													open={isOpenDishCommand}
													onOpenChange={setIsOpenDishCommand}
													courseFilter={courseFilterDishes}
												/>
											)}
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						<div className="grid grid-cols-2 items-center gap-x-2">
							{courses && (
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
																courses?.find(value => value.id === parseInt(field.value, 10))
																	?.name
																	? courses?.find(
																			value => value.id === parseInt(field.value, 10)
																	  )?.name
																	: "--select--"
																//default name for creating
															}
															<TriangleDownIcon className="ml-2" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent className="w-56">
														<DropdownMenuRadioGroup
															value={field.value}
															onValueChange={e => {
																field.onChange(e);
																setCourseFilterDishes(e);
															}}>
															{courses?.map(course => (
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
							)}
							<FormField
								control={form.control}
								name="selectionQuantity"
								render={({ field }) => (
									<FormItem>
										<div className="grid grid-cols-3 items-center gap-x-4">
											<FormLabel className="col-span-2">
												Select quantity of selection:
											</FormLabel>
											<FormControl className="col-span-1">
												<Input
													type="number"
													min={0}
													{...field}
													onChange={e => field.onChange(parseInt(e.target.value))}
												/>
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-between gap-4">
							{editSubSetData && (
								<SubSetDeleteDialog
									subSet={{
										id: editSubSetData.id,
										name: editSubSetData.name ?? "(No Name)",
									}}>
									<Button type="button" variant={"outline"}>
										Delete
									</Button>
								</SubSetDeleteDialog>
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
									{isSaving && <Loader2Icon className="mr-2 animate-spin" />}
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
