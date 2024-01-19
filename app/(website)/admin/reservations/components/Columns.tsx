"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import { DataTableColumnHeader } from "../../components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import Link from "next/link";
import { Separator } from "@components/ui/separator";
export type Reservations = {
	id: string;
	eventDate: string;
	eventDuration: number;
	eventType: string;
	totalPaid: number;
	totalCost: number;
	status: "ONGOING" | "COMPLETED" | "CANCELED";
	dishes: string[];
	setName: string;
	userID: number;
	userName: string;
	userPhoneNumber: string;
	transactions: {
		id: string;
		paymentID: string;
		createdAt: Date;
		netAmount: number;
		fee: number;
		message: string | null;
	}[];
	venue: {
		id: number;
		name: string;
		location: string;
		freeHours: number;
	};
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
		accessorKey: "userName",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Customer" />
		),
		cell: ({ row }) => (
			<Link href={"/admin/customers?customer=".concat(row.original.userName)}>
				{row.original.userName}
			</Link>
		),
	},
	{
		id: "Mobile Number",
		accessorKey: "userPhoneNumber",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Mobile Number" />
		),
	},
	{
		id: "Paid/Total cost",
		accessorKey: "totalPaid",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Paid/Total cost" />
		),
		cell: ({ row }) => {
			const totalPaid = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.original.totalPaid);
			const totalCost = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.original.totalCost);

			return (
				<div className="flex gap-2">
					<span>{totalPaid}</span>
					<Separator orientation="vertical" className="h-auto" />
					<span>{totalCost}</span>
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
		id: "Event Type",
		accessorKey: "eventType",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event Type" />
		),
	},
	{
		id: "Venue",
		accessorFn: data => data.venue.name,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Venue" />
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
