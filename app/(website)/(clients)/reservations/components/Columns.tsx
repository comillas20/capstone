"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@admin/components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { Separator } from "@components/ui/separator";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";

export type Reservations = {
	id: string;
	eventDate: string;
	eventDuration: number;
	eventType: string;
	totalCost: number;
	status: "PENDING" | "PARTIAL" | "ONGOING" | "COMPLETED" | "CANCELLED";
	dishes: string[];
	setName: string;
	transactions: {
		id: string;
		recipientNumber: string;
		referenceNumber: string;
		createdAt: string;
		message: string | null;
	}[];
	venue: {
		id: number;
		name: string;
		location: string;
		freeHours: number;
		maintainanceDates: Date[];
	};
};
export const columns: ColumnDef<Reservations>[] = [
	{
		id: "Reference Number",
		accessorFn: data => data.transactions,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Reference Number" />
		),
		cell: ({ row }) => {
			const transactions = row.original.transactions;
			if (transactions.length === 1)
				return row.original.transactions[0].referenceNumber;
			else
				return (
					<Popover>
						<PopoverTrigger>View</PopoverTrigger>
						<PopoverContent>
							{transactions.map(transaction => (
								<div key={transaction.id} className="flex gap-2">
									<span>{transaction.referenceNumber}</span>
									<Separator orientation="vertical" className="h-auto" />
									<span>{transaction.createdAt}</span>
									<Separator orientation="vertical" className="h-auto" />
									<span>sent to {transaction.recipientNumber}</span>
								</div>
							))}
						</PopoverContent>
					</Popover>
				);
		},
	},
	{
		id: "Total cost",
		accessorKey: "totalPaid",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Total cost" />
		),
		cell: ({ row }) => {
			const totalCost = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.original.totalCost);

			return totalCost;
		},
	},
	{
		id: "Event Date",
		accessorKey: "eventDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event Date" />
		),
		cell: ({ row }) => row.original.eventDate,
	},
	{
		id: "Event Duration",
		accessorKey: "eventDuration",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event Duration" />
		),
		cell: ({ row }) => String(row.original.eventDuration).concat(" hours"),
	},
	{
		id: "Event Type",
		accessorKey: "eventType",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event Type" />
		),
		cell: ({ row }) => row.original.eventType.toUpperCase(),
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
		cell: ({ row }) => (
			<DataTableRowActions
				key={row.original.id.concat(row.original.eventDate)}
				row={row}
			/>
		),
	},
];
