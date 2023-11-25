"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DataTableColumnHeader } from "@app/admin/components/DataTableColumnHeader";
import SetDeleteDialog from "./SetDeleteDialog";
import { Button } from "@components/ui/button";

export type Sets = {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
};

export const columns: ColumnDef<Sets>[] = [
	{
		id: "name",
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Set name" />
		),
		// cell: ({ row }) => (
		// 	<Button variant={"link"} className="p-0">
		// 		{row.getValue("name")}
		// 	</Button>
		// ),
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
