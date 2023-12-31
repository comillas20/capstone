"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import { DataTableColumnHeader } from "../../components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { convertDateToString } from "@lib/utils";
import Link from "next/link";
export enum status {
	true = "Accepted",
	false = "Pending",
}
export type Reservations = {
	id: string;
	customerName: string;
	mobileNumber: string;
	totalPaid?: number; // amount paid by user
	totalPrice: number; // total amount needed to fully pay
	reservationTime: string;
	eventTime: string;
	eventDuration: number;
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
		accessorKey: "id",
		header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
	},
	{
		id: "Customer",
		accessorKey: "customerName",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Customer" />
		),
		cell: ({ row }) => (
			<Link href={"/admin/customers?customer=".concat(row.original.customerName)}>
				{row.original.customerName}
			</Link>
		),
	},
	{
		id: "Mobile Number",
		accessorKey: "mobileNumber",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Mobile Number" />
		),
	},
	{
		id: "Paid/Total",
		accessorKey: "totalPaid",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Paid/Total" />
		),
		cell: ({ row }) => {
			const paid = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.original.totalPaid ?? 0);
			const needToPay = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.original.totalPrice);
			return `${paid}/${needToPay}`;
		},
	},
	{
		id: "Reserved",
		accessorKey: "reservationTime",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Reserved" />
		),
		cell: ({ row }) => {
			return convertDateToString(new Date(row.original.reservationTime));
		},
	},
	{
		id: "Event Time",
		accessorKey: "eventTime",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event Time" />
		),
		cell: ({ row }) => (
			<div>{convertDateToString(new Date(row.original.eventTime))}</div>
		),
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
				row.original.status == status.false && <DataTableRowActions row={row} />
			);
		},
	},
];
