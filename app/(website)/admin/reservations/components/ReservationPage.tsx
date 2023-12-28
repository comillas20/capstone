"use client";

import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	Table as t,
} from "@tanstack/react-table";

import { DataTablePagination } from "@admin/components/DataTablePagination";
import { convertDateToString } from "@lib/utils";
import { Calendar } from "@components/ui/calendar";
import { DataTableToolbar } from "./DataTableToolbar";
import ReservationTable from "./ReservationTable";
import { findNearestNonDisabledDate } from "@lib/date-utils";

interface ReservationPageProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	maintainanceDates: Date[] | undefined;
}

export default function ReservationPage<TData, TValue>({
	columns,
	data,
	maintainanceDates,
}: ReservationPageProps<TData, TValue>) {
	const currentDate = new Date();
	const nearestDateAvailable: Date = maintainanceDates
		? findNearestNonDisabledDate(currentDate, maintainanceDates)
		: currentDate;
	const [date, setDate] = React.useState<Date | undefined>(nearestDateAvailable);

	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});
	React.useEffect(() => {
		const hideAsDefault: VisibilityState = {
			email: false,
			"Mobile Number": false,
		};
		setColumnVisibility(hideAsDefault);
	}, []);
	return (
		<div className="w-full space-y-4">
			<DataTableToolbar table={table} />
			<div className="flex flex-col items-start gap-4 xl:flex-row">
				<Calendar
					className="rounded-md border"
					selected={date}
					onSelect={date => {
						const converted = date
							? convertDateToString(date, { year: true, month: true, day: true })
							: undefined;
						table.getColumn("Event Time")?.setFilterValue(converted);
						setDate(date);
					}}
					mode="single"
					disabled={maintainanceDates}
				/>
				<div className="space-y-4 xl:flex-1">
					<ReservationTable table={table} columns={columns} />
					<DataTablePagination table={table} />
				</div>
			</div>
		</div>
	);
}
