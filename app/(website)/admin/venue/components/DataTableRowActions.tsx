"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar, Calendar as CalendarIcon } from "lucide-react";
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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog"; // Added import for Dialog component
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { acceptReservation, denyReservation } from "../serverActions";
import { Reservations } from "./Columns";
import { useSWRConfig } from "swr";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { cn } from "@lib/utils";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DataTableRowActionsProps {
  row: Row<Reservations>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedMaintenanceDate, setSelectedMaintenanceDate] = useState<Date | undefined>();
  const { mutate } = useSWRConfig();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onSelect={() => setIsDatePickerOpen(true)}>
            Set as under maintenance
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsAcceptOpen(true)}>
            Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAcceptOpen} onOpenChange={setIsAcceptOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="mb-4">
            <AlertDialogTitle className="">Venue name</AlertDialogTitle>
            <div className="">
              Full Description of venue capacity, location, etc.
            </div>
          </AlertDialogHeader>
          <div className="flex justify-end gap-4">
            <AlertDialogCancel asChild>
              <Button variant={"secondary"} type="button" onClick={() => setIsAcceptOpen(false)}>
                Close
              </Button>
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}> {/* Updated component name */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Maintenance Date</DialogTitle>
          </DialogHeader>
		  <DayPicker
			mode="single"
			selected={selectedMaintenanceDate}
			onSelect={(day?: Date | undefined) => {
				if (day) {
					setSelectedMaintenanceDate(day); }
				 }} footer={selectedMaintenanceDate ? (
				 <p>You picked {format(selectedMaintenanceDate, "PP")}.</p>
				  ) : ( <p>Please pick a day.</p> )} 
				  initialFocus 
				  />
        </DialogContent>
      </Dialog>
    </>
  );
}