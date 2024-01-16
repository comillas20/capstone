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
import useSWR from "swr";
import { getReservations } from "../serverActions";
import { Loader2 } from "lucide-react";
import { columns } from "./Columns";
import { Button } from "@components/ui/button";



interface ReservationPage<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	maintainanceDates: Date[] | undefined;
}

function Reservation<TData, TValue>({
	columns,
	data,
	maintainanceDates,
}: ReservationPage<TData, TValue>) {
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
		<div className="flex justify-between items-center">
			<DataTableToolbar table={table} />
			<Button variant="outline">ADD</Button>
		</div>
		<div className="flex flex-col items-start gap-4 xl:flex-row">
			<div className="space-y-4 xl:flex-1">
			<ReservationTable table={table} columns={columns} />
			<DataTablePagination table={table} />
			</div>
		</div>
		</div>

	);
}

type ReservationPageProps = {
	maintainanceDates: Date[];
};
export default function ReservationPage({
	maintainanceDates,
}: ReservationPageProps) {
	const { data } = useSWR("ReservationPageData", async () => getReservations());
	if (!data) return <Loader2 className="animate-spin" size={15} />;
	return (
		<Reservation
			data={data}
			columns={columns}
			maintainanceDates={maintainanceDates}
		/>
	);
}
