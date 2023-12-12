"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";

interface DataTableRowActionsProps {
	onOpenAcceptDialogChange: React.Dispatch<React.SetStateAction<boolean>>;
	onOpenDenyDialogChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DataTableRowActions({
	onOpenAcceptDialogChange,
	onOpenDenyDialogChange,
}: DataTableRowActionsProps) {
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
				<DropdownMenuItem onSelect={() => onOpenAcceptDialogChange(true)}>
					Accept
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => onOpenDenyDialogChange(true)}>
					Deny
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
