import { Button } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Plus } from "lucide-react";
type SubSetAddDishesByCategoryProps = {
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
export default function SubSetAddDishesByCategory({
	dishes,
	onChange,
	value,
}: SubSetAddDishesByCategoryProps) {
	// Initialize an empty dictionary
	const dishesByCategory: { [key: string]: typeof dishes } = {};

	// Loop through the dishArray and populate the dictionary
	dishes.forEach(dish => {
		const key = dish.category.id + "_" + dish.category.name;

		// If the category id doesn't exist in the dictionary, initialize it with an empty array
		if (!dishesByCategory[key]) {
			dishesByCategory[key] = [];
		}

		// Push the dish to the corresponding category in the dictionary
		dishesByCategory[key].push(dish);
	});
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button type="button" variant={"outline"} size={"sm"}>
					<Plus size={15} className="mr-2" />
					By Category
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{Object.keys(dishesByCategory).map(key => {
					const [categoryId, categoryName] = key.split("_");
					const dishIDs = dishesByCategory[key].map(dish => dish.id);

					return (
						<DropdownMenuItem
							key={categoryId}
							onSelect={() => onChange(Array.from(new Set([...value, ...dishIDs])))}>
							{categoryName}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
