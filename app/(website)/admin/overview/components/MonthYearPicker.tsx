import { CalendarIcon } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select";

type MonthYearPickerProps = {
	reservations: {
		eventDate: Date;
	}[];
	currentDate: Date;
	month: number;
	onMonthChange: React.Dispatch<React.SetStateAction<number>>;
	year: number;
	onYearChange: React.Dispatch<React.SetStateAction<number>>;
};
export function MonthYearPicker({
	currentDate,
	month,
	onMonthChange,
	year,
	onYearChange,
	reservations,
}: MonthYearPickerProps) {
	const monthArray = [
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
	const currentYear = currentDate.getFullYear();
	const yearArray = () => {
		const years = new Set(reservations.map(ed => ed.eventDate.getFullYear()));
		const earliestYear = Math.min(...Array.from(years));
		return Array.from(
			{ length: currentYear - earliestYear + 1 },
			(_, index) => earliestYear + index
		);
	};
	return (
		<div className="flex items-center gap-1 rounded-xl border bg-primary p-1">
			<Select
				value={month.toString()}
				onValueChange={value => onMonthChange(parseInt(value))}>
				<SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
					<SelectValue />
				</SelectTrigger>
				<SelectContent className="w-56" align="end">
					{monthArray
						.filter(
							(value, index) =>
								!(currentYear === year && currentDate.getMonth() < index)
						)
						.map((value, index) => (
							<SelectItem key={value} value={index.toString()}>
								{value}
							</SelectItem>
						))}
				</SelectContent>
			</Select>
			<Select
				value={year.toString()}
				onValueChange={value => onYearChange(parseInt(value))}>
				<SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
					<SelectValue />
				</SelectTrigger>
				<SelectContent className="w-56" align="end">
					{yearArray().map(value => (
						<SelectItem key={value.toString()} value={value.toString()}>
							{value}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<CalendarIcon
				className="mx-2 justify-start font-normal text-primary-foreground"
				size={40}
			/>
		</div>
	);
}
