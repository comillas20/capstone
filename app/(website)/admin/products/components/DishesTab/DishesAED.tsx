import { Button } from "@components/ui/button";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTrigger,
	AlertDialogCancel,
	AlertDialogTitle,
	AlertDialogAction,
} from "@components/ui/alert-dialog";
import { Dishes } from "./DishColumns";
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
import { useSWRConfig } from "swr";
import { createOrUpdateDish, deleteDishes } from "../serverActions";
import { isAvailable as iaEnum } from "../ProductPageProvider";
import {
	PRODUCTS_DISHES_KEY,
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";
import { useContext, useTransition } from "react";
import { toast } from "@components/ui/use-toast";
import {
	DISHES_IMAGE_FOLDER,
	generateRandomString,
	imageWrapper,
} from "@lib/utils";
import { Loader2 } from "lucide-react";
import DishProfileDialog from "@components/DishProfileDialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
type AddEditDialogProps = {
	data?: Dishes;
	children: React.ReactNode;
};
export function AddEditDialog({ data, children }: AddEditDialogProps) {
	const { dishes, categories } = useContext(
		ProductPageContext
	) as ProductPageContextProps;
	const formSchema = z.object({
		id: z.number(),
		name: z
			.string()
			.min(1)
			.refine(
				e =>
					!dishes?.find(f => {
						//If user is editing, then exclude the current name in searching for duplicate
						const checker = data
							? f.name !== data?.name && f.name === e
							: f.name === e;
						return checker;
					}),
				{
					message: "This dish already exists!",
				}
			),
		image: z
			.custom(value => value instanceof File, {
				message: "Invalid File!",
			})
			.optional(),
		categoryID: z
			.number()
			.min(1)
			.refine(e => e > 0, {
				message:
					"Please choose a category the dish will fall under (e.g. Pork for Pork Ribs)",
			}),
		isAvailable: z.boolean(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: data
			? {
					id: data.id,
					name: data.name,
					image: undefined,
					categoryID: data.categoryID,
					isAvailable: data.isAvailable,
			  }
			: {
					id: -1,
					name: "",
					image: undefined,
					categoryID: -1,
					isAvailable: false,
			  },
	});

	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();
	function onSubmit(values: z.infer<typeof formSchema>) {
		const imageFileName = generateRandomString(10);
		const imageData = values.image
			? imageWrapper(values.image as File, imageFileName, "DISHES")
			: undefined;
		// Note to self: serverActions can't take complex objects such as Files
		// so I had to use FormData here
		const orig = {
			...values,
			image: imageData,
			imgHref: values.image
				? data && data.imgHref
					? data.imgHref
					: DISHES_IMAGE_FOLDER.concat(imageFileName)
				: undefined,
		};
		startSaving(async () => {
			const submitDish = await createOrUpdateDish(orig);
			if (submitDish) {
				toast({
					title: "Success",
					description: data
						? "The dish is successfully modified!"
						: "The dish is successfully created!",
					duration: 5000,
				});
				mutate(PRODUCTS_DISHES_KEY);
			}
		});
	}
	return (
		dishes && (
			<Dialog>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent>
					<DialogHeader className="mb-4">
						<DialogTitle>{data ? "Edit" : "Create"}</DialogTitle>
						<DialogDescription>
							{data ? data.name : "Create a new dish"}
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4"
							encType="multipart/form-data">
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
								name="image"
								render={({ field }) => (
									<FormItem>
										<div className="flex justify-between">
											<FormLabel>Dish Image</FormLabel>
											{data && (
												<DishProfileDialog data={data}>
													<Button
														type="button"
														variant="link"
														size="sm"
														className="h-auto p-0 leading-none">
														View Current Image
													</Button>
												</DishProfileDialog>
											)}
										</div>

										<FormControl>
											<Input
												accept="image/png, image/jpg"
												type="file"
												disabled={field.disabled}
												onChange={e => {
													if (e.target.files) field.onChange(e.target.files[0]);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="categoryID"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Category</FormLabel>
											<FormControl>
												<Select
													onValueChange={value => field.onChange(parseInt(value))}
													defaultValue={field.value > -1 ? String(field.value) : undefined}>
													<SelectTrigger>
														<SelectValue placeholder="--Select category--" />
													</SelectTrigger>
													<SelectContent>
														{categories.map(category => (
															<SelectItem key={category.id} value={String(category.id)}>
																{category.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="isAvailable"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Availability</FormLabel>
											<FormControl>
												<Select
													onValueChange={value => field.onChange(value === "true")}
													defaultValue={String(field.value)}>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="true">{iaEnum.true}</SelectItem>
														<SelectItem value="false">{iaEnum.false}</SelectItem>
													</SelectContent>
												</Select>
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
									{isSaving && <Loader2 className="mr-2 animate-spin" />}
									Save
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		)
	);
}

type DeleteDialogProps = {
	data: Dishes[];
	children: React.ReactNode;
} & React.ComponentProps<typeof AlertDialog>;

export function DeleteDialog({ data, children }: DeleteDialogProps) {
	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader className="mb-4">
					<AlertDialogTitle className="text-destructive">Delete</AlertDialogTitle>
					<AlertDialogDescription>
						Deleting{" "}
						{data.length > 1 ? "selected dishes" : data[0] ? data[0].name : "ERROR"}
					</AlertDialogDescription>
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
									const toBeYeeted: { id: number; imgHref: string | null }[] = data.map(
										d => ({
											id: d.id,
											imgHref: d.imgHref,
										})
									);
									startSaving(async () => {
										const submitDish = await deleteDishes(toBeYeeted);
										if (submitDish) {
											const plural =
												data.length > 1 ? "The selected dishes are" : data[0].name + " is";
											toast({
												title: "Success",
												description: plural + " successfully deleted!",
												duration: 5000,
											});
											mutate(PRODUCTS_DISHES_KEY);
										}
									});
								}}
								disabled={isSaving}>
								{isSaving && <Loader2 className="mr-2" />}
								Delete
							</Button>
						</AlertDialogAction>
					</div>
				</AlertDialogHeader>
			</AlertDialogContent>
		</AlertDialog>
	);
}
