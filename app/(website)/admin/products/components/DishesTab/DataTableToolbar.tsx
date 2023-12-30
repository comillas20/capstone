"use client";
import { Table, Row } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "@app/(website)/admin/components//DataTableViewOptions";
import { Info, Plus } from "lucide-react";
import { AddEditDialog, DeleteDialog } from "./DishesAED";
import { useContext, useState } from "react";
import { Dishes } from "./DishColumns";
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
	const [isOpen, setIsOpen] = useState(false);
	const { categories } = useContext(
		ProductPageContext
	) as ProductPageContextProps;
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const selectedRowsData: Dishes[] = table
		.getSelectedRowModel()
		.rows.map(({ original }) => original) as unknown as Dishes[];
	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter dishes..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={event =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				<DataTableViewOptions table={table} />
				{(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
					<DeleteDialog data={selectedRowsData}>
						<Button
							variant="destructive"
							onClick={() => setIsDeleteDialogOpen(true)}
							className="h-8">
							Delete selected
						</Button>
					</DeleteDialog>
				)}
			</div>
			{categories?.length == 0 && (
				<p className="mr-4 flex items-center text-sm text-primary">
					<Info className="mr-2" />
					Please add a category first before adding a dish
				</p>
			)}
			<AddEditDialog key={isOpen.toString()}>
				<Button
					size="sm"
					className="flex h-8"
					onClick={() => setIsOpen(true)}
					disabled={categories?.length == 0}>
					<Plus className="mr-2" />
					Dish
				</Button>
			</AddEditDialog>
		</div>
	);
}
