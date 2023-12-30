"use client";

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
	AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { Row } from "@tanstack/react-table";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
}

export function DataTableRowActions<TData>({
	row,
}: DataTableRowActionsProps<TData>) {
	return (
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
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<DropdownMenuItem>Accept</DropdownMenuItem>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader className="mb-4">
							<AlertDialogTitle className="text-destructive">
								Accept reservation
							</AlertDialogTitle>
							<AlertDialogDescription>
								{"Accepting " + row.getValue("Customer") + "'s reservation"}
							</AlertDialogDescription>
							<div className="text-destructive">
								This action cannot be undo. Continue?
							</div>
						</AlertDialogHeader>
						<div className="flex justify-end gap-4">
							<AlertDialogCancel asChild>
								<Button variant={"secondary"} type="button">
									Cancel
								</Button>
							</AlertDialogCancel>
							<AlertDialogAction>Accept</AlertDialogAction>
						</div>
					</AlertDialogContent>
				</AlertDialog>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<DropdownMenuItem>Deny</DropdownMenuItem>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader className="mb-4">
							<AlertDialogTitle className="text-destructive">
								Deny reservation
							</AlertDialogTitle>
							<AlertDialogDescription>
								{"Denying " + row.getValue("Customer") + "'s reservation"}
							</AlertDialogDescription>
							<div className="text-destructive">
								This action cannot be undo. Continue?
							</div>
						</AlertDialogHeader>
						<div className="flex justify-end gap-4">
							<AlertDialogCancel asChild>
								<Button variant={"secondary"} type="button">
									Cancel
								</Button>
							</AlertDialogCancel>
							<AlertDialogAction>Deny</AlertDialogAction>
						</div>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
