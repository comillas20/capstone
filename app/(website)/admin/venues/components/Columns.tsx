"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import { DataTableColumnHeader } from "../../components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
export type Venues = {
	id: number;
	name: string;
	location: string;
	freeHours: number;
	venueCost: number;
	maxCapacity: number;
	maintainanceDates: Date[];
};

export const columns: ColumnDef<Venues>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
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
			<DataTableColumnHeader column={column} title="Name" />
		),
	},
	{
		accessorKey: "location",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Location" />
		),
	},
	{
		id: "Free Hours",
		accessorKey: "freeHours",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Free Hours" />
		),
	},
	{
		id: "Venue Cost",
		accessorKey: "venueCost",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Venue Cost" />
		),
	},
	{
		id: "Max Capacity",
		accessorKey: "maxCapacity",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Max Capacity" />
		),
	},
	{
		id: "actions",
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
