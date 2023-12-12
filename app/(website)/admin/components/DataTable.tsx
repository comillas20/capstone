"use client";

import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	Table as t,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@components/ui/table";

import { DataTablePagination } from "./DataTablePagination";
import { cn } from "@lib/utils";

interface DataTableToolbarProps<TData> {
	table: t<TData>;
}
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	Toolbar: React.ComponentType<DataTableToolbarProps<TData>>;
	rowClassName?: string;
	selectFirstRowAsDefault?: boolean;
	singleSelection?: (data: TData) => void;
	hideAsDefault?: VisibilityState;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	Toolbar,
	rowClassName,
	selectFirstRowAsDefault,
	hideAsDefault,
	singleSelection,
}: DataTableProps<TData, TValue>) {
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
		if (selectFirstRowAsDefault) setRowSelection({ "0": true });
		if (hideAsDefault) setColumnVisibility(hideAsDefault);
	}, []);
	return (
		<div className="space-y-4">
			{Toolbar && <Toolbar table={table} />}
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
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className={cn(
										!!singleSelection
											? "data-[state=selected]:bg-primary data-[state=selected]:text-primary-foreground"
											: "",
										rowClassName
									)}
									onClick={() => {
										if (singleSelection && !row.getIsSelected()) {
											table.toggleAllRowsSelected(false);
											row.toggleSelected(true);
											singleSelection(row.original);
										}
									}}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
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
			<DataTablePagination table={table} singleSelection={!!singleSelection} />
		</div>
	);
}
