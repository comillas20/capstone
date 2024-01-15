"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { Row } from "@tanstack/react-table";
import { SetStateAction, useState } from "react";
import { acceptReservation, denyReservation } from "../serverActions";
import { Reservations } from "./Columns";
import { useSWRConfig } from "swr";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@components/ui/dialog";

interface DataTableRowActionsProps {
	row: Row<Reservations>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
	const [isAcceptOpen, setIsAcceptOpen] = useState(false);
	const [isDenyOpen, setIsDenyOpen] = useState(false);
	const [isMaintenance, setIsmaintenance] =useState(false);
	const { mutate } = useSWRConfig();
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
	const [selectedMaintenanceDate, setSelectedMaintenanceDate] = useState<Date | null>(null);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
						<DotsHorizontalIcon className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[160px]">
				<DropdownMenuItem onSelect={() => setIsDatePickerOpen(true)}>
						Set as undermaintenance
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setIsAcceptOpen(true)}>
						Details
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialog open={isAcceptOpen} onOpenChange={setIsAcceptOpen}>
				<AlertDialogContent>
					<AlertDialogHeader className="mb-4">
						<AlertDialogTitle className="">
							Venue name
						</AlertDialogTitle>

						<div className="">
							Full Description of venue
							capacity, location etc.
						</div>
					</AlertDialogHeader>
					<div className="flex justify-end gap-4">
						<AlertDialogCancel asChild>
							<Button variant={"secondary"} type="button">
								Close
							</Button>
						</AlertDialogCancel>
					</div>
				</AlertDialogContent>
			</AlertDialog>
			<Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Select Maintenance Date</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      Choose the date when the menu item will be under maintenance.
    </DialogDescription>
    <DatePicker
      selected={selectedMaintenanceDate}
      onChange={(date: SetStateAction<Date | null>) => setSelectedMaintenanceDate(date)}
    />
    <DialogFooter>
      <Button
        variant="secondary"
        onClick={() => setIsDatePickerOpen(false)}
      >
        Cancel
      </Button>
      <Button
        onClick={() => {
          // Handle the selected maintenance date (selectedMaintenanceDate)
          setIsDatePickerOpen(false);
        }}
      >
        Set Maintenance Date
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

		</>
	);
}
