"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import { DataTableColumnHeader } from "../../components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { convertDateToString } from "@lib/utils";

type Customers = {
	name: string;
	phoneNumber: string;
	createdAt: Date;
};

export const columns: ColumnDef<Customers>[] = [
	// {
	// 	id: "select",
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={table.getIsAllPageRowsSelected()}
	// 			onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
	// 			aria-label="Select all"
	// 			className="translate-y-[2px]"
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={value => row.toggleSelected(!!value)}
	// 			aria-label="Select row"
	// 			className="translate-y-[2px]"
	// 		/>
	// 	),
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Customer" />
		),
	},
	{
		id: "Mobile Number",
		accessorKey: "phoneNumber",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Mobile Number" />
		),
	},
	{
		id: "Created",
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created" />
		),
		cell: ({ row }) => {
			return convertDateToString(row.original.createdAt);
		},
	},
	// {
	// 	id: "actions",
	// 	cell: () => <DataTableRowActions />,
	// },
];
