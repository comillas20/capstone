"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import AddEditDialog from "./AddEditDialog";
import { useState } from "react";
import { isAvailable } from "../../page";
import DeleteDialog from "./DeleteDialog";
import { DataTableColumnHeader } from "@app/admin/components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { CldUploadButton } from "next-cloudinary";
import { saveDishImage } from "../serverActions";
import { toast } from "@components/ui/use-toast";
import { mutate } from "swr";
import DishProfileDialog from "./DishProfileDialog";
import { Button } from "@components/ui/button";
import { AlertCircle } from "lucide-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@components/ui/hover-card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@components/ui/tooltip";

export type Dishes = {
	id: number;
	name: string;
	categoryID: number;
	category: string;
	courseID: number;
	course: string;
	createdAt: string;
	updatedAt: string;
	imgHref: string | null;
	isAvailable: isAvailable;
	price: number;
};

export const columns: ColumnDef<Dishes>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={value => table.toggleAllRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),

		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Dish name" />
		),
		cell: ({ row }) => {
			const dishName = row.getValue("name") as string;
			const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
			return (
				// <CldUploadButton
				// 	uploadPreset="zy3i7msr"
				// 	className="select-none p-0 hover:underline"
				// 	onUpload={result => {
				// 		if (result.info) {
				// 			if (result.info.hasOwnProperty("public_id")) {
				// 				const info = result.info as { public_id: string };
				// 				console.log(info.public_id);
				// 				if (dishName) {
				// 					startSaving(async () => {
				// 						const dishImg = await saveDishImage(info.public_id, dishName);

				// 						if (dishImg) {
				// 							toast({
				// 								title: "Success",
				// 								description:
				// 									"The image for " + dishName + " is successfully uploaded!",
				// 								duration: 5000,
				// 							});
				// 							mutate("dpGetAllDishes");
				// 							mutate("aedGetAllCategories");
				// 							mutate("aedGetAllCourses");
				// 							mutate("aedGetAllDishes");

				// 							mutate("ssaedGetAllDishes");
				// 						}
				// 					});
				// 				}
				// 			}
				// 		}
				// 	}}
				// 	options={{ multiple: false }}>
				// 	{dishName}
				// </CldUploadButton>
				<div className="flex items-center gap-2">
					{/* <Button
						variant={"link"}
						className="select-none p-0 font-medium text-inherit"
						onClick={() => setIsDialogOpen(true)}>
						{row.original.name}
					</Button> */}
					<DishProfileDialog
						data={row.original}
						openDialog={isDialogOpen}
						onOpenChange={setIsDialogOpen}
					/>
					{!row.original.imgHref && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<AlertCircle size={15} className="text-primary" />
								</TooltipTrigger>
								<TooltipContent>
									<p>No image provided</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "category",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Category" />
		),
	},
	{
		accessorKey: "course",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Course" />
		),
	},
	{
		id: "Created",
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created" />
		),
	},
	{
		id: "Last Updated",
		accessorKey: "updatedAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Last Updated" />
		),
	},
	{
		id: "Availability",
		accessorKey: "isAvailable",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Availability" />
		),
	},
	{
		id: "Price/Pack",
		accessorKey: "price",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Price/Pack" />
		),
		cell: ({ row }) => {
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.getValue("Price/Pack"));

			return formatted;
		},
	},
	{
		id: "actions",
		cell: ({ row, table }) => {
			// const payment = row.original;
			const [isAEOpen, setIsAEOpen] = useState(false);
			const [isDeleteOpen, setIsDeleteOpen] = useState(false);
			return (
				<>
					<DataTableRowActions
						row={row}
						table={table}
						addEditOpener={setIsAEOpen}
						deleteOpener={setIsDeleteOpen}
					/>
					<AddEditDialog
						data={row.original}
						open={isAEOpen}
						onOpenChange={setIsAEOpen}
					/>
					<DeleteDialog
						data={row.original}
						open={isDeleteOpen}
						onOpenChange={setIsDeleteOpen}
					/>
				</>
			);
		},
	},
];
