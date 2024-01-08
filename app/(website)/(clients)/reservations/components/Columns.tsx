"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@admin/components/DataTableColumnHeader";
import { convertDateToString } from "@lib/utils";
import { DataTableRowActions } from "./DataTableRowActions";
import { DropdownMenuItem } from "@components/ui/dropdown-menu";
import { addDays, isAfter, isSameDay } from "date-fns";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import HelpToolTip from "@components/HelpTooltip";

export type Reservations = {
	id: string;
	eventDate: Date;
	reservedAt: Date;

	net_amount: number;
	fee: number;
	totalCost: number;

	status: "ACCEPTED" | "PENDING" | "DENIED";
	eventDuration: number;
	message: string | null;

	setName: string;
	dishes: string[];
};
export const columns: ColumnDef<Reservations, any>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
	},
	{
		id: "Paid/Total",
		accessorKey: "totalCost",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Paid/Total" />
		),
		cell: ({ row }) => {
			const paid = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.original.net_amount + row.original.fee);
			const needToPay = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.original.totalCost);
			return (
				<div className="flex gap-1">
					<span>{paid}</span>
					<Separator orientation="vertical" />
					<span>{needToPay}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => (
			<div>
				{row.original.status}{" "}
				{row.original.status === "PENDING" && (
					<HelpToolTip>The admin is still considering your reservation.</HelpToolTip>
				)}
			</div>
		),
	},
	{
		id: "Event Date",
		accessorKey: "eventDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event Date" />
		),
		cell: ({ row }) => (
			<div>{convertDateToString(new Date(row.original.eventDate))}</div>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const currentDate = new Date();
			const active = isAfter(row.original.eventDate, addDays(currentDate, 7));
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
