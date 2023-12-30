"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@components/ui/checkbox";
import { AddEditDialog, DeleteDialog } from "./DishesAED";
import { useState } from "react";
import { isAvailable } from "../../page";
import { DataTableColumnHeader } from "@app/(website)/admin/components/DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { AlertCircle } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@components/ui/tooltip";
import { convertDateToString } from "@lib/utils";

export type Dishes = {
	id: number;
	name: string;
	categoryID: number;
	category: string;
	createdAt: Date;
	updatedAt: Date;
	imgHref: string | null;
	isAvailable: boolean;
};

export const columns: ColumnDef<Dishes>[] = [
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
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Dish name" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					{row.original.name}
					{!row.original.imgHref && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<AlertCircle size={15} className="text-primary" />
								</TooltipTrigger>
								<TooltipContent>
									<p>No image provided</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "category",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Category" />
		),
	},
	{
		id: "Created",
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created" />
		),
		cell: ({ row }) => convertDateToString(row.original.createdAt),
	},
	{
		id: "Last Updated",
		accessorKey: "updatedAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Last Updated" />
		),
		cell: ({ row }) => convertDateToString(row.original.updatedAt),
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
				</>
			);
		},
	},
];
