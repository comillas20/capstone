"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Checkbox } from "@components/ui/checkbox";
import AddEditDialog from "./AddEditDialog";
import { useState } from "react";
import useSWR from "swr";
import { isAvailable } from "../../page";
import DeleteDialog from "./DeleteDialog";

export type Dishes = {
	id: number;
	name: string;
	categoryID: number;
	category: string;
	courseID: number;
	course: string;
	createdAt: string;
	updatedAt: string;
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
	// {
	// 	accessorKey: "id",
	// 	header: "ID",
	// },
	{
		accessorKey: "name",
		header: "Dish name",
	},
	{
		accessorKey: "category",
		header: "Category",
	},
	{
		accessorKey: "course",
		header: "Course",
	},
	{
		accessorKey: "createdAt",
		header: "Created",
	},
	{
		accessorKey: "updatedAt",
		header: "Last Updated",
	},
	{
		accessorKey: "isAvailable",
		header: "Availability",
	},
	{
		accessorKey: "price",
		header: "Price/Pack",
		cell: ({ row }) => {
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.getValue("price"));

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
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="h-8 w-8 p-0"
								disabled={table.getIsSomeRowsSelected()}>
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Options</DropdownMenuLabel>
							<DropdownMenuItem onSelect={() => setIsAEOpen(true)}>
								Edit {row.getValue("name")}
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-destructive"
								onSelect={() => setIsDeleteOpen(true)}>
								Delete {row.getValue("name")}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<AddEditDialog
						data={row.original}
						open={isAEOpen}
						onOpenChange={setIsAEOpen}
					/>
					<DeleteDialog
						data={row.original}
						open={isDeleteOpen}
						onOpenChange={setIsAEOpen}
					/>
				</>
			);
		},
	},
];
