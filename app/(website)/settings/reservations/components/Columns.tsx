"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@admin/components/DataTableColumnHeader";
import { convertDateToString } from "@lib/utils";
import { DataTableRowActions } from "./DataTableRowActions";
import { DropdownMenuItem } from "@components/ui/dropdown-menu";
import { addDays, isAfter, isSameDay } from "date-fns";
import { Button } from "@components/ui/button";

export type Reservations = {
	id: string;
	totalPaid?: number; // amount paid by user
	totalPrice: number; // total amount needed to fully pay
	reservationTime: Date;
	eventTime: Date;
	eventDuration: number;
};
export const columns: ColumnDef<Reservations, any>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
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
		id: "actions",
		cell: ({ row }) => {
			const currentDate = new Date();
			const active = isAfter(row.original.eventTime, addDays(currentDate, 7));
			return active ? (
				<DataTableRowActions>
					<DropdownMenuItem>Edit</DropdownMenuItem>
					<DropdownMenuItem>Cancel</DropdownMenuItem>
					<DropdownMenuItem>Details</DropdownMenuItem>
				</DataTableRowActions>
			) : (
				<Button variant="link" size="sm">
					Details
				</Button>
			);
		},
	},
];
