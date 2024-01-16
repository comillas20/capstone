"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import { DataTableColumnHeader } from "../../components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { convertDateToString } from "@lib/utils";
import Link from "next/link";
import { Separator } from "@components/ui/separator";
import { Button } from "@components/ui/button";
export type Reservations = {
	id: string;
	payment_id: string;
	eventDate: string;
	reservedAt: Date;
	net_amount: number;
	fee: number;
	totalCost: number;
	status: "ACCEPTED" | "PENDING" | "DENIED" | "IGNORED" | "CANCELED";
	eventDuration: number;
	dishes: string[];
	message: string | null;
	setName: string;
	user_id: number;
	user_name: string;
	user_phoneNumber: string;
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
		accessorKey: "id",
		header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
	},
	{
		id: "Customer",
		accessorKey: "user_name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Venue" />
		),
		cell: ({ row }) => (
			<Link href={"/admin/customers?customer=".concat(row.original.user_name)}>
				{row.original.user_name}
			</Link>
		),
	},
	{
		id: "Mobile Number",
		accessorKey: "user_phoneNumber",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Location" />
		),
	},
	{
		id: "Reserved",
		accessorKey: "reservedAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Max Capacity" />
		),
		cell: ({ row }) => {
			return convertDateToString(row.original.reservedAt);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Location" />
		),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			if (row.original.status === "PENDING")
				return <DataTableRowActions row={row} />;
		},
	},
];
