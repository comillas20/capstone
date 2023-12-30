"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import { DataTableColumnHeader } from "../../components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { status } from "../page";
import { convertDateToString } from "@lib/utils";
import { useState } from "react";
import IrreversableConfirmationDialog from "@components/IrreversableConfirmationDialog";
import { Button } from "@components/ui/button";
import Link from "next/link";

export type Reservations = {
	id: number;
	customerName: string;
	email: string | null;
	mobileNumber: string | null;
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
		accessorKey: "email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Email" />
		),
		cell: ({ cell }) => {
			return cell.getValue() ?? "Not Provided";
		},
	},
	{
		id: "Mobile Number",
		accessorKey: "mobileNumber",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Mobile Number" />
		),
		cell: ({ cell }) => {
			return cell.getValue() ?? "Not Provided";
		},
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
