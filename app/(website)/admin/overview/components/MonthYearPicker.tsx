"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Separator } from "@components/ui/separator";

export function MonthYearPicker() {
	const monthsArray = [
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
	const yearsArray = [2019, 2020, 2021, 2022, 2023];
	const now = new Date();
	const [month, setMonth] = useState<number>(now.getMonth());
	const [year, setYear] = useState<number>(now.getFullYear());
	return (
		<div className="flex items-center gap-1 rounded-xl border bg-primary p-1 text-primary-foreground">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant={"ghost"} className="focus-visible:ring-0">
						{monthsArray[month]}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuRadioGroup
						value={month.toString()}
						onValueChange={value => setMonth(parseInt(value))}>
						{monthsArray.map((value, index) => (
							<DropdownMenuRadioItem key={value} value={index.toString()}>
								{value}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant={"ghost"} className="focus-visible:ring-0">
						{year}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuRadioGroup
						value={year.toString()}
						onValueChange={value => setYear(parseInt(value))}>
						{yearsArray.map(value => (
							<DropdownMenuRadioItem key={value} value={value.toString()}>
								{value}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<CalendarIcon className="mx-2 justify-start font-normal" size={20} />
		</div>
	);
}
