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

export type Reservations = {
	customerName: string;
	email: string | null;
	mobileNumber: string | null;
	reservationTime: string;
	eventTime: string;
	initialEventDuration: number;
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
		id: "Customer",
		accessorKey: "customerName",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Customer" />
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
		id: "Reserved",
		accessorKey: "reservationTime",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Reserved" />
		),
		cell: ({ cell }) => {
			return convertDateToString(new Date(cell.getValue() as string));
		},
	},
	{
		id: "Event Time",
		accessorKey: "eventTime",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Event Time" />
		),
		cell: ({ cell }) => {
			return convertDateToString(new Date(cell.getValue() as string));
		},
	},
	{
		id: "Initial Duration",
		accessorKey: "initialEventDuration",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Initial Duration" />
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
			const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
			const [isDenyDialogOpen, setIsDenyDialogOpen] = useState(false);
			return (
				row.original.status == status.false && (
					<>
						<DataTableRowActions
							onOpenAcceptDialogChange={setIsAcceptDialogOpen}
							onOpenDenyDialogChange={setIsDenyDialogOpen}
						/>
						<IrreversableConfirmationDialog
							title={"Accept reservation"}
							description={"Accepting " + row.original.customerName + "'s reservation"}
							message="This action cannot be undo. Continue?"
							open={isAcceptDialogOpen}
							onOpenChange={setIsAcceptDialogOpen}>
							<Button>Accept</Button>
						</IrreversableConfirmationDialog>
						<IrreversableConfirmationDialog
							title={"Deny reservation"}
							description={"Denying " + row.original.customerName + "'s reservation"}
							message="This action cannot be undo. Continue?"
							open={isDenyDialogOpen}
							onOpenChange={setIsDenyDialogOpen}>
							<Button>Deny</Button>
						</IrreversableConfirmationDialog>
					</>
				)
			);
		},
	},
];
