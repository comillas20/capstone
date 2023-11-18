"use client";
import { Table } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "@app/admin/components//DataTableViewOptions";
import { PlusCircleIcon } from "lucide-react";
import AddEditDialog from "./AddEditDialog";
import { useState } from "react";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter tasks..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={event =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				<DataTableViewOptions table={table} />
			</div>
			<Button
				size="sm"
				className="ml-auto hidden h-8 lg:flex"
				onClick={() => setIsOpen(true)}>
				<PlusCircleIcon className="mr-2" />
				New dish
			</Button>
			<AddEditDialog open={isOpen} onOpenChange={setIsOpen}></AddEditDialog>
		</div>
	);
}
