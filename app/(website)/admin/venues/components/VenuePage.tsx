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
import { DataTableToolbar } from "./DataTableToolbar";
import VenueTable from "./VenueTable";
import { findNearestNonDisabledDate } from "@lib/date-utils";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { Venues, columns } from "./Columns";
import { Button } from "@components/ui/button";
import { getAllVenues } from "@app/(website)/serverActionsGlobal";

type ReservationPage = {
	columns: ColumnDef<Venues, any>[];
	data: Venues[];
	maintainanceDates: Date[] | undefined;
};

function Reservation({ columns, data, maintainanceDates }: ReservationPage) {
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
				<div className="space-y-4 xl:flex-1">
					<VenueTable table={table} columns={columns} />
					<DataTablePagination table={table} />
				</div>
			</div>
		</div>
	);
}

type VenuePageProps = {
	maintainanceDates: Date[];
};
export default function VenuePage({ maintainanceDates }: VenuePageProps) {
	const { data } = useSWR("VenuePage", getAllVenues);
	if (!data) return <Loader2 className="animate-spin" size={15} />;
	return (
		<Reservation
			data={data}
			columns={columns}
			maintainanceDates={maintainanceDates}
		/>
	);
}
