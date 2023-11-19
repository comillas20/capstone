"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "@app/admin/components/DataTableViewOptions";

// import { priorities, statuses } from "../../reservations/data/data";
import { DataTableFacetedFilter } from "@app/admin/components/DataTableFacetedFilter";
import { useTransition } from "react";
import { PlusCircleIcon } from "lucide-react";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const [isSaving, startSaving] = useTransition();
	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter tasks..."
					value={(table.getColumn("customer")?.getFilterValue() as string) ?? ""}
					onChange={event =>
						table.getColumn("customer")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				<DataTableViewOptions table={table} />
			</div>
			<Button disabled={isSaving}>
				<PlusCircleIcon className="mr-2" />
				New set
			</Button>
		</div>
	);
}
