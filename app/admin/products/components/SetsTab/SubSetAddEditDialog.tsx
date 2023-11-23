import { Button } from "@components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import { useEffect, useState, useTransition } from "react";
import useSWR, { mutate } from "swr";
import {
	createSubset,
	editSubset,
	getAllCourses,
	getAllDishes,
	getAllSubSets,
} from "../serverActions";
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
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@components/ui/command";
import { CheckIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import { cn } from "@lib/utils";
import { ScrollArea } from "@components/ui/scroll-area";
import { Badge } from "@components/ui/badge";
import { Plus, X } from "lucide-react";
import SubSetAddDishesByCategory from "./SubSetAddDishesByCategory";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import SubSetDeleteDialog from "./SubSetDeleteDialog";

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
	const allSets = useSWR("ssaedGetAllSets", getAllSubSets);
	const allDishes = useSWR("ssaedGetAllDishes", getAllDishes);

	const allCourses = useSWR("ssaedGetAllCourses", getAllCourses);
	const formSchema = z.object({
		id: z.number(),
		name: z
			.string()
			.min(1, {
				message: "Subset name must contain at least 1 character",
			})
			.refine(
				e =>
					!allSets.data?.find(f => {
						//If user is editing, then exclude the current name in searching for duplicate
						const checker = editSubSetData
							? f.name !== editSubSetData?.name && f.name === e
							: f.name === e;
						return checker;
					}),
				{
					message: "This subset name already exists!",
				}
			),
		setID: z.number().min(1),
		dishes: z.array(z.number().min(1)).min(1, {
			message: "Dishes must contain at least 1 elements",
		}),
		courseID: z.string().min(1),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: editSubSetData
			? {
					id: editSubSetData.id,
					name: editSubSetData.name,
					setID: setID,
					dishes: editSubSetData.dishes.map(dish => dish.id),
					courseID: editSubSetData.course.id.toString(),
			  }
			: {
					id: -1,
					name: "",
					setID: setID,
					dishes: [],
					courseID: "",
			  },
	});
	useEffect(() => {
		form.reset({
			id: editSubSetData ? editSubSetData.id : -1,
			name: editSubSetData ? editSubSetData.name : "",
			setID: setID,
			dishes: editSubSetData ? editSubSetData.dishes.map(dish => dish.id) : [],
			courseID: editSubSetData ? editSubSetData.course.id.toString() : "",
		});
	}, [editSubSetData, form.reset]);
	useEffect(() => {
		form.reset();
	}, [props.open]);
	function onSubmit(values: z.infer<typeof formSchema>) {
		if (props.onOpenChange) props.onOpenChange(false);
		startSaving(async () => {
			const modValues = { ...values, courseID: parseInt(values.courseID) };
			const submitSubSet = editSubSetData
				? await editSubset(modValues)
				: await createSubset(modValues);

			if (submitSubSet) {
				toast({
					title: "Success",
					description: editSubSetData
						? values.name + " is successfully modified!"
						: values.name + " is successfully created!",
					duration: 5000,
				});

				mutate("spGetAllSets");
				mutate("ssaedGetAllSets");
			}
		});
	}
	const [isOpenDishCommand, setIsOpenDishCommand] = useState(false);
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle>Create</DialogTitle>
					<DialogDescription>Create a new subset</DialogDescription>
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
						{allDishes.data && (
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
															const foundDish = allDishes.data?.find(
																dishData => dishData.id === dish
															);
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
											{allDishes.data && (
												<SubSetAddDishesByCategory
													dishes={allDishes.data}
													onChange={field.onChange}
													value={field.value}
												/>
											)}
											<Button
												type="button"
												variant={"outline"}
												size={"sm"}
												onClick={() => field.onChange([])}>
												Clear all
											</Button>
										</div>
										<FormControl>
											<CommandDialog
												open={isOpenDishCommand}
												onOpenChange={setIsOpenDishCommand}>
												<CommandInput placeholder="Search dishes..." />
												<CommandList>
													<CommandEmpty>No results found.</CommandEmpty>
													<CommandGroup>
														{allDishes.data &&
															allDishes.data
																.sort((a, b) => a.name.localeCompare(b.name))
																.map(dish => (
																	<CommandItem
																		key={dish.id}
																		onSelect={() => {
																			const alreadyExists = field.value.find(id => id === dish.id);
																			if (alreadyExists) {
																				const updatedValue = field.value.filter(
																					id => id !== dish.id
																				);
																				field.onChange(updatedValue);
																			} else field.onChange([...field.value, dish.id]);
																		}}>
																		{dish.name}
																		<CheckIcon
																			className={cn(
																				"ml-auto h-4 w-4",
																				field.value.find(id => id === dish.id)
																					? "opacity-100"
																					: "opacity-0"
																			)}
																		/>
																	</CommandItem>
																))}
													</CommandGroup>
												</CommandList>
											</CommandDialog>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						{allCourses.data && (
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
																: "--select--"
															//default name for creating
														}
														<TriangleDownIcon className="ml-2" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="w-56">
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
						)}

						<div className="flex justify-between gap-4">
							{editSubSetData && (
								<SubSetDeleteDialog
									subSet={{ id: editSubSetData.id, name: editSubSetData.name }}>
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
