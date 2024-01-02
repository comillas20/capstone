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
import { AddEditDialog, DeleteDialog } from "./DishesAED";
import { Dishes } from "./DishColumns";

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
				<AddEditDialog key={row.getValue("name")} data={row.original as Dishes}>
					<DropdownMenuItem onSelect={e => e.preventDefault()}>
						Edit {row.getValue("name")}
					</DropdownMenuItem>
				</AddEditDialog>
				<DeleteDialog data={[row.original as Dishes]}>
					<DropdownMenuItem onSelect={e => e.preventDefault()}>
						Delete {row.getValue("name")}
					</DropdownMenuItem>
				</DeleteDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
