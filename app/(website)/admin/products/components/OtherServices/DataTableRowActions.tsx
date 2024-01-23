"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row, Table } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { AddEditDialog, DeleteDialog } from "./ServicesAED";
import { Services } from "./Columns";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
	table: Table<TData>;
}

export function DataTableRowActions<TData>({
	row,
	table,
}: DataTableRowActionsProps<TData>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
					disabled={table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()}>
					<DotsHorizontalIcon className="h-4 w-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<AddEditDialog
					key={JSON.stringify(row.original)}
					data={row.original as Services}>
					<DropdownMenuItem onSelect={e => e.preventDefault()}>
						Edit {row.getValue("Service")}
					</DropdownMenuItem>
				</AddEditDialog>
				<DeleteDialog data={[row.original as Services]}>
					<DropdownMenuItem onSelect={e => e.preventDefault()}>
						Disable {row.getValue("Service")}
					</DropdownMenuItem>
				</DeleteDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
