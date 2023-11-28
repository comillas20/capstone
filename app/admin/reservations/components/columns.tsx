"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import { DataTableColumnHeader } from "../../components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { status } from "../page";

type Reservations = {
	customerName: string;
	reservationTime: string;
	eventTime: string;
	initialEventDuration: number;
	status: status;
};
export const columns: ColumnDef<Reservations>[] = [
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
		id: "Customer",
		accessorKey: "customerName",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Customer" />
		),
	},
	{
		id: "Reservation Time",
		accessorKey: "reservationTime",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Reservation Time" />
		),
	},
	{
		id: "Event Time",
		accessorKey: "eventTime",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event Time" />
		),
	},
	{
		id: "Initial Duration",
		accessorKey: "initialEventDuration",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Initial Duration" />
		),
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
	},
	{
		id: "actions",
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
