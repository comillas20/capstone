"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@admin/components/DataTableColumnHeader";
import { convertDateToString } from "@lib/utils";
import { DataTableRowActions } from "./DataTableRowActions";
import { addDays, isAfter, isSameDay } from "date-fns";
import { Button } from "@components/ui/button";
import HelpToolTip from "@components/HelpTooltip";
import { Separator } from "@components/ui/separator";

export type Reservations = {
	id: string;
	status: "ONGOING" | "COMPLETED" | "CANCELED";
	eventDate: Date;
	totalPaid: number;
	totalCost: number;
	eventType: string;

	eventDuration: number;
	reservedAt: Date;

	message: string[] | null;

	setName: string;
	dishes: string[];
};
export const columns: ColumnDef<Reservations, any>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
	},
	{
		id: "Paid/Cost",
		accessorKey: "totalCost",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Paid/Cost" />
		),
		cell: ({ row }) => {
			const paid = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.original.totalPaid);
			const needToPay = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.original.totalCost);
			return (
				<div className="flex gap-1">
					<span>{paid}</span>
					<Separator orientation="vertical" className="h-auto" />
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
	},
	{
		id: "Event Date",
		accessorKey: "eventDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event Date" />
		),
		cell: ({ row }) => <div>{convertDateToString(row.original.eventDate)}</div>,
	},
	{
		id: "Event Type",
		accessorKey: "eventType",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event Type" />
		),
	},
	{
		id: "actions",
		cell: ({ row, table }) => {
			return row.original.status === "ONGOING" ? (
				<DataTableRowActions row={row} table={table} />
			) : (
				<Button variant="link" size="sm">
					Details
				</Button>
			);
		},
	},
];
