"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "@app/(website)/admin/components/DataTableViewOptions";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import { AddEditDialog } from "./VenueAED";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter venues..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={event =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				<DataTableViewOptions table={table} />
			</div>
			<AddEditDialog>
				<Button size="sm" className="flex">
					<Plus className="mr-2" />
					Venue
				</Button>
			</AddEditDialog>
		</div>
	);
}
