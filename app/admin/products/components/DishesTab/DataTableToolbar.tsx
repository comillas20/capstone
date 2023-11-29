"use client";
import { Table, Row } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "@app/admin/components//DataTableViewOptions";
import { Info, Plus } from "lucide-react";
import AddEditDialog from "./AddEditDialog";
import { useState } from "react";
import useSWR from "swr";
import { getAllCategories, getAllCourses } from "../serverActions";
import DeleteDialog from "./DeleteDialog";
import { Dishes } from "./DishColumns";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const [isOpen, setIsOpen] = useState(false);
	const categories = useSWR("dtCategoryToolbar", getAllCategories);
	const courses = useSWR("dtCourseToolbar", getAllCourses);
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
					<>
						<Button size={"sm"} onClick={() => setIsDeleteDialogOpen(true)}>
							Delete selected
						</Button>
						<DeleteDialog
							open={isDeleteDialogOpen}
							onOpenChange={setIsDeleteDialogOpen}
							data={selectedRowsData}
						/>
					</>
				)}
			</div>
			{(categories.data?.length == 0 || courses.data?.length == 0) && (
				<p className="mr-4 flex items-center text-sm text-primary">
					<Info className="mr-2" />
					Please add a category and a course first before adding a dish
				</p>
			)}
			<Button
				size="sm"
				className="flex"
				onClick={() => setIsOpen(true)}
				disabled={categories.data?.length == 0 || courses.data?.length == 0}>
				<Plus className="mr-2" />
				Dish
			</Button>
			<AddEditDialog open={isOpen} onOpenChange={setIsOpen} />
		</div>
	);
}
