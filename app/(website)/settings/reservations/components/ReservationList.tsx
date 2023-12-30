"use client";
import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import ReservationTable from "./ReservationTable";

type ReservationPageProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
};

export default function ReservationList<TData, TValue>({
	columns,
	data,
}: ReservationPageProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
		},
		enableRowSelection: true,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});
	return (
		<div className="w-full space-y-4">
			<div className="flex flex-col items-start gap-4 xl:flex-row">
				<div className="space-y-4 xl:flex-1">
					<ReservationTable table={table} columns={columns} />
				</div>
			</div>
		</div>
	);
}
