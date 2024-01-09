"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import { DataTableColumnHeader } from "../../components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { convertDateToString } from "@lib/utils";
import Link from "next/link";
import { Separator } from "@components/ui/separator";
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
			<DataTableColumnHeader column={column} title="Customer" />
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
			<DataTableColumnHeader column={column} title="Mobile Number" />
		),
	},
	{
		id: "Reserved",
		accessorKey: "reservedAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Reserved" />
		),
		cell: ({ row }) => {
			return convertDateToString(new Date(row.original.reservedAt));
		},
	},
	{
		id: "Fee/Net Amount",
		accessorKey: "net_amount",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Fee/Net Amount" />
		),
		cell: ({ row }) => {
			const fee = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.original.fee);
			const netAmount = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.original.net_amount);
			return (
				<div className="flex gap-2">
					<span>{fee}</span>
					<Separator orientation="vertical" className="h-auto" />
					<span>{netAmount}</span>
				</div>
			);
		},
	},
	{
		id: "Event Date",
		accessorKey: "eventDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event Date" />
		),
		cell: ({ row }) => <div>{row.original.eventDate}</div>,
	},
	{
		id: "Duration",
		accessorKey: "eventDuration",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Duration" />
		),
		cell: ({ cell }) => {
			return (cell.getValue() as string) + " hours";
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return (
				row.original.status === "PENDING" && <DataTableRowActions row={row} />
			);
		},
	},
];
