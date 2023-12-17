"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "@app/(website)/admin/components/DataTableViewOptions";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@components/ui/button";
import { useSearchParams } from "next/navigation";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export default function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const searchInURL = useSearchParams().get("customer");
	useEffect(() => {
		if (searchInURL) table.getColumn("name")?.setFilterValue(searchInURL);
	}, []);
	return (
		<div className="flex flex-1 items-center space-x-2">
			<Input
				placeholder="Search customers..."
				value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
				onChange={event =>
					table.getColumn("name")?.setFilterValue(event.target.value)
				}
				className="h-8 w-[150px] lg:w-[250px]"
			/>
			<DataTableViewOptions table={table} />
		</div>
	);
}
