"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "@app/(website)/admin/components/DataTableViewOptions";
import { useContext, useState } from "react";
import SetAddEditDialog from "./SetAddEditDialog";
import { Info, Plus } from "lucide-react";
import { Button } from "@components/ui/button";
import {
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const { venues } = useContext(ProductPageContext) as ProductPageContextProps;
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
			{venues?.length === 0 && (
				<p className="mr-4 flex items-center text-sm text-primary">
					<Info className="mr-2" />
					Please add a venue first before adding a set
				</p>
			)}
			<Button
				size="sm"
				className="flex"
				onClick={() => setIsOpen(true)}
				disabled={venues?.length === 0}>
				<Plus className="mr-2" />
				Set
			</Button>
			<SetAddEditDialog open={isOpen} onOpenChange={setIsOpen} />
		</div>
	);
}
