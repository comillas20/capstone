"use client";
import calamares from "@app/sample/items/calamares.jpg";
import Image from "next/image";
import { Dishes, columns } from "./Columns";
import { Card, CardContent, CardFooter, CardTitle } from "@components/ui/card";
import { useEffect, useState } from "react";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@components/ui/table";
import { Button } from "@components/ui/button";
import useSWR from "swr";
import { getAllDishes } from "../serverActions";
import { convertDateToString } from "@lib/utils";
import { isAvailable } from "../../page";

export default function DishesPage() {
	const [rowSelection, setRowSelection] = useState({});
	const { data } = useSWR("getAllDishes", async () => {
		const d = await getAllDishes();
		const dishes: Dishes[] = d.map(dish => ({
			id: dish.id,
			name: dish.name,
			categoryID: dish.category.id,
			category: dish.category.name,
			courseID: dish.course.id,
			course: dish.course.name,
			createdAt: convertDateToString(dish.createdAt),
			updatedAt: convertDateToString(dish.updatedAt),
			isAvailable: dish.isAvailable ? isAvailable.true : isAvailable.false,
			price: dish.price,
		}));
		return dishes;
	});
	//Had to do this to bypass TS type check, @data will only be undefined during loading (e.g. slow internet)
	const d2 = data ? data : [];
	const table = useReactTable({
		data: d2,
		columns,
		state: {
			rowSelection,
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
	});
	useEffect(() => {
		table.setPageSize(6);
	}, []);
	return (
		<>
			<div>
				<Card className="justify-items-center pt-6">
					<CardContent>
						<Image
							src={calamares}
							alt={"calamares"}
							className="bottom-0 left-0 right-0 top-0 h-80 w-full"
						/>
					</CardContent>
					<CardFooter className="flex justify-center">
						<CardTitle>Calamares</CardTitle>
					</CardFooter>
				</Card>
			</div>
			<div className="flex-1">
				<div>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map(headerGroup => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map(header => {
											return (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
												</TableHead>
											);
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map(row => (
										<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
											{row.getVisibleCells().map(cell => (
												<TableCell key={cell.id} className="cursor-pointer select-none">
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={columns.length} className="h-24 text-center">
											No results.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
					<div className="flex items-center justify-end space-x-2 py-4">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}>
							Next
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
