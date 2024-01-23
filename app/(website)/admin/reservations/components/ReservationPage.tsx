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
import { Reservations, columns } from "./Columns";

interface Reservation {
	columns: ColumnDef<Reservations, any>[];
	data: Reservations[];
	maintainanceDates: Date[] | undefined;
}

function Reservation<TData, TValue>({
	columns,
	data,
	maintainanceDates,
}: Reservation) {
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
			id: false,
			email: false,
			"Mobile Number": false,
			"Event Type": false,
			Venue: false,
		};
		setColumnVisibility(hideAsDefault);
	}, []);

	const { selectedVenue } = React.useContext(
		ReservationPageContext
	) as ReservationPageContextProps;
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
						table.getColumn("Event Date")?.setFilterValue(converted);
						setDate(date);
					}}
					mode="single"
					disabled={selectedVenue ? maintainanceDates : false}
				/>
				<div className="space-y-4 xl:flex-1">
					<ReservationTable table={table} columns={columns} />
					<DataTablePagination table={table} />
				</div>
			</div>
		</div>
	);
}

type Venue = {
	maintainanceDates: Date[];
	id: number;
	name: string;
	location: string;
	freeHours: number;
	venueCost: number;
	maxCapacity: number;
};
export type ReservationPageContextProps = {
	selectedVenue: Venue | undefined;
	setSelectedVenue: React.Dispatch<React.SetStateAction<Venue | undefined>>;
	reservationTableDataKey: string;
};

export const ReservationPageContext = React.createContext<
	ReservationPageContextProps | undefined
>(undefined);
export default function ReservationPage() {
	const reservationTableDataKey = "ReservationPageData";
	const { data } = useSWR(reservationTableDataKey, getReservations);
	const [selectedVenue, setSelectedVenue] = React.useState<Venue | undefined>();
	if (!data) return <Loader2 className="animate-spin" size={15} />;
	return (
		<ReservationPageContext.Provider
			value={{ selectedVenue, setSelectedVenue, reservationTableDataKey }}>
			<Reservation data={data} columns={columns} maintainanceDates={[]} />
		</ReservationPageContext.Provider>
	);
}
