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
		id: "Event Type",
		accessorKey: "eventType",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event Type" />
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
