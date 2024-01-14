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
import { useContext } from "react";
import {
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";

type SubSetAddDishesByCommandProps = {
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	courseFilter: string | undefined;
	dishes: {
		name: string;
		id: number;
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
	const { categories } = useContext(
		ProductPageContext
	) as ProductPageContextProps;
	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput placeholder="Search dishes..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					{dishes &&
						dishes
							.filter(dish => {
								// find the category the dish is under
								const category = categories.find(
									category => category.id === dish.category.id
								);
								// checks if the course (id) used to filter is the same
								// as the course (id) of the category found earlier is under
								// returns true (no filter) if there is no filter or if there is no category found
								return courseFilter && category
									? category.course.id.toString() === courseFilter
									: true;
							})
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
