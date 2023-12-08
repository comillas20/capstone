import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@components/ui/command";
import { cn } from "@lib/utils";
import { CheckIcon } from "lucide-react";

type SubSetAddDishesByCommandProps = {
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	courseFilter: string | undefined;
	dishes: {
		name: string;
		id: number;
		course: {
			id: number;
			name: string;
		};
		createdAt: Date;
		updatedAt: Date;
		isAvailable: boolean;
		category: {
			name: string;
			id: number;
		};
	}[];
	onChange: (...event: any[]) => void;
	value: number[];
};
export default function SubSetAddDishesByCommand({
	open,
	onOpenChange,
	dishes,
	onChange,
	value,
	courseFilter,
}: SubSetAddDishesByCommandProps) {
	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput placeholder="Search dishes..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					{dishes &&
						dishes
							.filter(dish =>
								courseFilter ? dish.course.id.toString() === courseFilter : true
							)
							.sort((a, b) => a.name.localeCompare(b.name))
							.map(dish => (
								<CommandItem
									key={dish.id}
									onSelect={() => {
										const alreadyExists = value.find(id => id === dish.id);
										if (alreadyExists) {
											const updatedValue = value.filter(id => id !== dish.id);
											onChange(updatedValue);
										} else onChange([...value, dish.id]);
									}}>
									{dish.name}
									<CheckIcon
										className={cn(
											"ml-auto h-4 w-4",
											value.find(id => id === dish.id) ? "opacity-100" : "opacity-0"
										)}
									/>
								</CommandItem>
							))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
