"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button, buttonVariants } from "@components/ui/button";
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
import { useContext, useState, useTransition } from "react";
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
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@components/ui/table";
import { changeStatus } from "../serverActions";
import { toast } from "@components/ui/use-toast";
import {
	ReservationPageContext,
	ReservationPageContextProps,
} from "./ReservationPage";
import { Loader2 } from "lucide-react";

interface DataTableRowActionsProps {
	row: Row<Reservations>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
	const { reservationTableDataKey } = useContext(
		ReservationPageContext
	) as ReservationPageContextProps;
	const [isChangingStatus, startChangingStatus] = useTransition();
	const [isDenyOpen, setIsDenyOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
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
					{(row.original.status === "PENDING" ||
						row.original.status === "PARTIAL") && (
						<DropdownMenuItem
							onSelect={() =>
								startChangingStatus(async () => {
									const id = row.original.id;
									const result = await changeStatus(id, "ONGOING");
									if (result) {
										toast({
											title: "Success",
											description: "The selected reservation is successfully accepted",
											duration: 5000,
										});
										mutate(reservationTableDataKey);
									}
								})
							}
							disabled={isChangingStatus}>
							Accept
						</DropdownMenuItem>
					)}
					<DropdownMenuItem
						onSelect={() => setIsDenyOpen(true)}
						disabled={isChangingStatus}>
						Cancel
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
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
						<AlertDialogCancel
							className={buttonVariants({ variant: "secondary" })}
							type="button">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								startChangingStatus(async () => {
									const id = row.original.id;
									const result = await changeStatus(id, "CANCELLED");
									if (result) {
										toast({
											title: "Success",
											description: "The selected reservation is successfully cancelled",
											duration: 5000,
										});
										mutate(reservationTableDataKey);
									}
								})
							}
							disabled={isChangingStatus}>
							{isChangingStatus && <Loader2 className="mr-2 animate-spin" />}
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
