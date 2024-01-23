"use client";
import { Table } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "@app/(website)/admin/components//DataTableViewOptions";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Services } from "./Columns";
import { AddEditDialog, DeleteDialog } from "./ServicesAED";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const selectedRowsData: Services[] = table
		.getSelectedRowModel()
		.rows.map(({ original }) => original) as unknown as Services[];
	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Search a service..."
					value={(table.getColumn("Service")?.getFilterValue() as string) ?? ""}
					onChange={event =>
						table.getColumn("Service")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				<DataTableViewOptions table={table} />
				{(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
					<DeleteDialog data={selectedRowsData}>
						<Button size={"sm"} variant="destructive" className="h-8">
							Disable selected
						</Button>
					</DeleteDialog>
				)}
			</div>
			<AddEditDialog>
				<Button size="sm" className="flex h-8">
					<Plus className="mr-2" />
					Service
				</Button>
			</AddEditDialog>
		</div>
	);
}
