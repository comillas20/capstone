"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import { useState } from "react";
import { DataTableColumnHeader } from "@app/(website)/admin/components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { isAvailable, isRequired } from "../../page";
import AddEditDialog from "./AddEditDialog";
import DeleteDialog from "./DeleteDialog";
export type Services = {
	id: number;
	name: string;
	price: number;
	duration: number | null;
	unit: number | null;
	isRequired: boolean;
	isAvailable: boolean;
};

export const columns: ColumnDef<Services>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={value => table.toggleAllRowsSelected(!!value)}
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
		id: "Service",
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Service" />
		),
		cell: ({ row }) => {
			return <div className="flex items-center gap-2">{row.original.name}</div>;
		},
	},
	{
		accessorKey: "duration",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Duration" />
		),
	},
	{
		accessorKey: "unit",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Unit" />
		),
	},

	{
		accessorKey: "price",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Price" />
		),
		cell: ({ row }) => {
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "PHP",
			}).format(row.getValue("price"));

			return formatted;
		},
	},
	{
		id: "Required",
		accessorKey: "isRequired",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Required" />
		),
		cell: ({ row }) => {
			return row.original.isRequired ? isRequired.true : isRequired.false;
		},
	},
	{
		id: "Availability",
		accessorKey: "isAvailable",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Availability" />
		),
		cell: ({ row }) => {
			return row.original.isAvailable ? isAvailable.true : isAvailable.false;
		},
	},
	{
		id: "actions",
		cell: ({ row, table }) => {
			// const payment = row.original;
			const [isAEOpen, setIsAEOpen] = useState(false);
			const [isDeleteOpen, setIsDeleteOpen] = useState(false);
			return (
				<>
					<DataTableRowActions
						row={row}
						table={table}
						addEditOpener={setIsAEOpen}
						deleteOpener={setIsDeleteOpen}
					/>
					<AddEditDialog
						open={isAEOpen}
						onOpenChange={setIsAEOpen}
						data={row.original}
					/>
					<DeleteDialog
						open={isDeleteOpen}
						onOpenChange={setIsDeleteOpen}
						data={[row.original]}
					/>
				</>
			);
		},
	},
];
