"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import AddEditDialog from "./AddEditDialog";
import { useState } from "react";
import { isAvailable } from "../../page";
import DeleteDialog from "./DeleteDialog";
import { DataTableColumnHeader } from "@app/admin/components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";

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
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Dish" />
		),
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
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created" />
		),
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Last Updated" />
		),
	},
	{
		accessorKey: "isAvailable",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Availability" />
		),
	},
	{
		accessorKey: "price",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Price/Pack" />
		),
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
						onOpenChange={setIsAEOpen}
					/>
				</>
			);
		},
	},
];
