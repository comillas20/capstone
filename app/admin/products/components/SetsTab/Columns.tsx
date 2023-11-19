"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import { useState } from "react";
import { DataTableColumnHeader } from "@app/admin/components/DataTableColumnHeader";
import { Checkbox } from "@components/ui/checkbox";
import { DataTableRowActions } from "./DataTableRowActions";

export type Sets = {
	id: number;
	name: string;
	subSets: {
		id: number;
		name: string;
		dishes: {
			id: number;
			name: string;
			isAvailable: boolean;
			price: number;
			category: {
				id: number;
				name: string;
			};
		}[];
		course: {
			id: number;
			name: string;
		};
	}[];
};

export const columns: ColumnDef<Sets>[] = [
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
				</>
			);
		},
	},
];
