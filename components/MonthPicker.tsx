"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export function MonthPicker() {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const now = new Date();
	const [currentMonth, setCurrentMonth] = useState(now.getMonth());
	const currentYear = now.getFullYear();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					id="date"
					variant={"outline"}
					className="w-56 justify-start text-center font-normal">
					<CalendarIcon className="mr-2 h-4 w-4" />
					<span>{months[currentMonth].concat(" ", currentYear.toString())}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuGroup>
					{months.map(value => (
						<DropdownMenuItem key={value}>{value}</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
