"use client";
import calamares from "@app/sample/items/calamares.jpg";
import Image from "next/image";
import { Dishes, columns } from "./Columns";
import { useState } from "react";
import { Button } from "@components/ui/button";
import useSWR from "swr";
import { getAllDishes } from "../serverActions";
import { convertDateToString } from "@lib/utils";
import { isAvailable } from "../../page";
import AddEditDialog from "./AddEditDialog";
import { PlusCircleIcon } from "lucide-react";
import { DataTable } from "@app/admin/components/DataTable";
import { DataTableToolbar } from "./DataTableToolbar";

export default function DishesPage() {
	const { data } = useSWR("dpGetAllDishes", async () => {
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
	return (
		<div className="flex flex-col space-y-2">
			<div className="flex justify-end"></div>
			<div className="flex gap-6 pt-4">
				{/* <div className="hidden lg:block">
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
				</div> */}
				<div className="flex-1">
					{/* <div>
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
															: flexRender(
																	header.column.columnDef.header,
																	header.getContext()
															  )}
													</TableHead>
												);
											})}
										</TableRow>
									))}
								</TableHeader>
								<TableBody>
									{table.getRowModel().rows?.length ? (
										table.getRowModel().rows.map(row => (
											<TableRow
												key={row.id}
												data-state={row.getIsSelected() && "selected"}>
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
					</div> */}
					<DataTable data={d2} columns={columns} Toolbar={DataTableToolbar} />
				</div>
			</div>
		</div>
	);
}
