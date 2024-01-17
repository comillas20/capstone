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
} from "@components/ui/alert-dialog";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { acceptReservation, denyReservation } from "../serverActions";
import { Reservations } from "./Columns";
import { useSWRConfig } from "swr";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@components/ui/table";

interface DataTableRowActionsProps {
	row: Row<Reservations>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
	const [isAcceptOpen, setIsAcceptOpen] = useState(false);
	const [isDenyOpen, setIsDenyOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isAddtionalOpen, setIsAddtionalOpen] = useState(false);
	const { mutate } = useSWRConfig();
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
					<DropdownMenuItem onSelect={() => setIsModalOpen(true)}>
						Details
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setIsAcceptOpen(true)}>
						Accept
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setIsDenyOpen(true)}>
						Deny
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialog open={isAcceptOpen} onOpenChange={setIsAcceptOpen}>
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
						<AlertDialogAction
							onClick={async () => {
								const result = await acceptReservation(row.original.id);
								if (result) mutate("ReservationPageData");
							}}>
							Accept
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
			<AlertDialog open={isDenyOpen} onOpenChange={setIsDenyOpen}>
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
						<AlertDialogAction
							onClick={async () => {
								const data = row.original;
								const result = await denyReservation(
									data.id,
									data.fee + data.net_amount,
									data.payment_id
								);
								if (result) mutate("ReservationPageData");
							}}>
							Deny
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Item List</DialogTitle>
						<DialogDescription>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[100px]">ID</TableHead>
										<TableHead>Package Name</TableHead>
										<TableHead className="text-right">Amount</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell className="font-medium">ID</TableCell>
										<TableCell>220 Perhear</TableCell>
										<TableCell className="text-right">$250.00</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Dialog>
							<DialogTrigger>Additional Orders</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Are you absolutely sure?</DialogTitle>
									<DialogDescription>
										This action cannot be undone. This will permanently delete your
										account and remove your data from our servers.
									</DialogDescription>
								</DialogHeader>
							</DialogContent>
						</Dialog>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
