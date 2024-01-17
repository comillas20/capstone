"use client";

import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent } from "@components/ui/dialog";
import { Row } from "@tanstack/react-table";
import { Venues } from "./Columns";
import { Calendar } from "@components/ui/calendar";
import { cn } from "@lib/utils";
import { updateMaintainanceDates } from "../serverActions";
import { toast } from "@components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { AddEditDialog, DeleteDialog } from "./VenueAED";

interface DataTableRowActionsProps {
	row: Row<Venues>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
	const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
	const [dates, setDates] = React.useState<Date[] | undefined>(
		row.original.maintainanceDates
	);
	const [isSaving, startSaving] = React.useTransition();
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
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem onSelect={() => setIsDatePickerOpen(true)}>
						View maintainance dates
					</DropdownMenuItem>
					<AddEditDialog key={row.original.name} data={row.original}>
						<DropdownMenuItem onSelect={e => e.preventDefault()}>
							Edit {row.original.name}
						</DropdownMenuItem>
					</AddEditDialog>
					<DeleteDialog data={row.original}>
						<DropdownMenuItem
							onSelect={e => e.preventDefault()}
							className="text-destructive">
							Delete {row.original.name}
						</DropdownMenuItem>
					</DeleteDialog>
				</DropdownMenuContent>
			</DropdownMenu>
			<Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
				<DialogContent className="flex w-fit items-end gap-6">
					<Calendar
						className="p-0"
						mode="multiple"
						onSelect={setDates}
						selected={dates}
						classNames={{
							head_cell:
								"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
							cell: cn(
								buttonVariants({ variant: "ghost" }),
								"h-9 w-9 p-0 font-normal aria-selected:opacity-100"
							),
							day: cn(
								buttonVariants({ variant: "ghost" }),
								"h-8 w-8 p-0 font-normal aria-selected:opacity-100"
							),
						}}
						fixedWeeks
					/>
					<div className="flex w-40 flex-col space-y-8">
						<Button
							onClick={() => {
								startSaving(async () => {
									const result = dates
										? await updateMaintainanceDates(dates, row.original.id)
										: null;
									toast({
										title: "Success",
										description: result ? "Saved!" : "Failed to save",
										duration: 5000,
									});
								});
							}}
							disabled={isSaving}>
							{isSaving && <Loader2 className="mr-2 animate-spin" />}
							Save
						</Button>
						<DialogClose className={buttonVariants({ variant: "outline" })}>
							Close
						</DialogClose>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
