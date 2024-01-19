"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@components/ui/input";
import { DataTableViewOptions } from "@app/(website)/admin/components/DataTableViewOptions";
import { Button } from "@components/ui/button";
import { Loader2, Plus } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select";
import { Reservations } from "./Columns";
import useSWR from "swr";
import { getAllVenues } from "@app/(website)/serverActionsGlobal";
import { useContext } from "react";
import {
	ReservationPageContext,
	ReservationPageContextProps,
} from "./ReservationPage";

interface DataTableToolbarProps {
	table: Table<Reservations>;
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
	const venues = useSWR("Reservations.DTT.Venues", getAllVenues);
	const { selectedVenue, setSelectedVenue } = useContext(
		ReservationPageContext
	) as ReservationPageContextProps;
	if (!venues.data) return <Loader2 className="animate-spin" />;
	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter customers..."
					value={(table.getColumn("Customer")?.getFilterValue() as string) ?? ""}
					onChange={event =>
						table.getColumn("Customer")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				<DataTableViewOptions table={table} />
			</div>
			<div className="flex flex-1 items-center justify-end space-x-2">
				{table.getColumn("Venue") && (
					<Select
						onValueChange={value => {
							const selected = venues.data?.find(venue => venue.name === value);
							if (!selected) {
								setSelectedVenue(undefined);
								table.getColumn("Venue")?.setFilterValue("");
							} else {
								setSelectedVenue(selected);
								table.getColumn("Venue")?.setFilterValue(value);
							}
						}}
						defaultValue="all">
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Select a venue" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={"all"}>All</SelectItem>
							{venues.data.map(venue => (
								<SelectItem key={venue.id} value={venue.name}>
									{venue.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
				<Button size="sm" className="flex">
					<Plus className="mr-2" />
					Reservations
				</Button>
			</div>
		</div>
	);
}
