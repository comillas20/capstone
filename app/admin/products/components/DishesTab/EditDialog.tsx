import { Button } from "@components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
} from "@components/ui/dialog";
import {
	DialogClose,
	DialogTitle,
	DialogTrigger,
} from "@radix-ui/react-dialog";
import { Dishes } from "./Columns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import useSWR, { useSWRConfig } from "swr";
import { ddmCategories, ddmCourses, editDish } from "../serverActions";
import { isAvailable as iaEnum } from "../../page";
import { useState, useTransition } from "react";
import { toast } from "@components/ui/use-toast";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { TriangleDownIcon } from "@radix-ui/react-icons";

type EditDialogProps = {
	data: Dishes;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
} & React.ComponentProps<typeof Dialog>;
export default function EditDialog({
	data,
	open,
	onOpenChange,
}: EditDialogProps) {
	const formSchema = z.object({
		id: z.number(),
		name: z.string().min(1),
		categoryID: z.string(),
		courseID: z.string(),
		isAvailable: z.string(),
		price: z.string().min(1),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: data.id,
			name: data.name,
			categoryID: data.categoryID.toString(),
			courseID: data.courseID.toString(),
			isAvailable: data.isAvailable,
			price: data.price.toString(),
		},
	});

	const allCategories = useSWR("dtCategories", ddmCategories, {
		revalidateOnReconnect: true,
	});

	const allCourses = useSWR("dtCourses", ddmCourses, {
		revalidateOnReconnect: true,
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
			const submitDish = await editDish(orig);
			if (submitDish) {
				toast({
					title: "Success",
					description: "The dish is successfully modified!",
					duration: 5000,
				});
				mutate("getAllDishes");
			}
		});
	}
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle>Edit</DialogTitle>
					<DialogDescription>{data.name}</DialogDescription>
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
														{
															allCategories.data?.find(
																value => value.id === parseInt(field.value.toString())
															)?.name
														}
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
																value => value.id === parseInt(field.value.toString())
															)?.name
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
										<FormLabel>Price:</FormLabel>
										<FormControl>
											<Input type="number" onChange={field.onChange} value={field.value} />
										</FormControl>
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
	);
}
