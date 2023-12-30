"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import { useState } from "react";
import { DataTableColumnHeader } from "@app/(website)/admin/components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { isAvailable, isRequired } from "../ProductPageProvider";
export type Services = {
	id: number;
	name: string;
	price: number;
	unit: number | null;
	unitName: string | null;
	isRequired: boolean;
	isAvailable: boolean;
};

export const columns: ColumnDef<Services>[] = [
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
		id: "Service",
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Service" />
		),
		cell: ({ row }) => {
			return <div className="flex items-center gap-2">{row.original.name}</div>;
		},
	},
	{
		accessorKey: "unit",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Unit" />
		),
	},
	{
		id: "Unit Name",
		accessorKey: "unitName",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Unit Name" />
		),
	},
	{
		accessorKey: "price",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Price" />
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
		id: "Required",
		accessorKey: "isRequired",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Required" />
		),
		cell: ({ row }) => {
			return row.original.isRequired ? isRequired.true : isRequired.false;
		},
	},
	{
		id: "Availability",
		accessorKey: "isAvailable",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Availability" />
		),
		cell: ({ row }) => {
			return row.original.isAvailable ? isAvailable.true : isAvailable.false;
		},
	},
	{
		id: "actions",
		cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
	},
];
