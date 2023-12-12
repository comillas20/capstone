"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "@app/(website)/admin/components/DataTableViewOptions";
import { useState } from "react";
import SetAddEditDialog from "./SetAddEditDialog";
import { Plus } from "lucide-react";
import { Button } from "@components/ui/button";

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
					placeholder="Filter sets..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={event =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				<DataTableViewOptions table={table} />
			</div>
			<Button size="sm" className="flex" onClick={() => setIsOpen(true)}>
				<Plus className="mr-2" />
				Set
			</Button>
			<SetAddEditDialog open={isOpen} onOpenChange={setIsOpen} />
		</div>
	);
}
