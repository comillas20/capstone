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

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
	table: Table<TData>;
	addEditOpener: React.Dispatch<React.SetStateAction<boolean>>;
	deleteOpener: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DataTableRowActions<TData>({
	row,
	table,
	addEditOpener,
	deleteOpener,
}: DataTableRowActionsProps<TData>) {
	return (
		<>
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
					<DropdownMenuItem onSelect={() => addEditOpener(true)}>
						Edit {row.getValue("name")}
					</DropdownMenuItem>
					<DropdownMenuItem
						className="text-destructive"
						onSelect={() => deleteOpener(true)}>
						Delete {row.getValue("name")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
