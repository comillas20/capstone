"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@app/(website)/admin/components/DataTableColumnHeader";
import SetDeleteDialog from "./SetDeleteDialog";

export type Sets = {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
	minimumPerHead: number;
	price: number;
	venue: string;
};

export const columns: ColumnDef<Sets>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Set" />,
	},
	{
		accessorKey: "venue",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Venue" />
		),
	},
	{
		id: "Created",
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created" />
		),
	},
	{
		id: "Last Updated",
		accessorKey: "updatedAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Last Updated" />
		),
	},
	{
		accessorKey: "minimumPerHead",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Minimum Packs" />
		),
	},
	{
		accessorKey: "price",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Price/Head" />
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
		id: "actions",
		cell: ({ row }) => {
			return (
				<SetDeleteDialog
					rowData={row.original}
					isRowSelected={row.getIsSelected()}
				/>
			);
		},
	},
];
