import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Label } from "@components/ui/label";

type SetCardsProps = {
	title: string;
	subSets: {
		name: string;
		dishes: {
			id: Number;
			name: string;
			isAvailable: boolean;
			price: number;
			category: {
				id: number;
				name: string;
			};
			course: {
				id: number;
				name: string;
			};
		}[];
	}[];
	allCategories: {
		id: number;
		name: string;
	}[];
	selected?: boolean;
	selectProducts: (
		dishes:
			| {
					id: Number;
					name: string;
					isAvailable: boolean;
					price: number;
					category: {
						id: number;
						name: string;
					};
					course: {
						id: number;
						name: string;
					};
			  }
			| undefined
	) => void;
};

export default function SetCards({
	title,
	subSets,
	selected,
	selectProducts,
	allCategories,
}: SetCardsProps) {
	// Function to check if a category has dishes
	const categoryHasDishes = (categoryId: number): boolean => {
		// Find the subset that corresponds to the category
		const subsetWithCategory = subSets.find(subset =>
			subset.dishes.some(dish => dish.category.id === categoryId)
		);

		// If a subset with dishes for the category is found, return true; otherwise, return false
		return !!subsetWithCategory;
	};

	// Check all categories
	const categoriesWithDishes = allCategories.filter(category =>
		categoryHasDishes(category.id)
	);

	function findDish(id: string) {
		for (const subSet of subSets) {
			const dish = subSet.dishes.find(dish => dish.id.toString() === id);
			if (dish) return dish;
		}
		return undefined;
	}

	return (
		<Card className="w-full border-none">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">{title}</CardTitle>
				<p className="text-muted-foreground">Choose one from each category</p>
			</CardHeader>
			<CardContent className="flex flex-row justify-around gap-4">
				{categoriesWithDishes.map(category => (
					<div key={category.id}>
						<h2 className="mb-2 text-lg">{category.name}</h2>
						<RadioGroup
							disabled={!selected}
							onValueChange={e => selectProducts(findDish(e))}
							defaultValue="none">
							{subSets
								.flatMap(subSet =>
									subSet.dishes.filter(dish => dish.category.name === category.name)
								)
								.map(dish => (
									<Label
										key={dish.id.toString()}
										className="flex items-center space-x-2">
										<RadioGroupItem value={dish.id.toString()} />
										<span>{dish.name}</span>
									</Label>
								))}
						</RadioGroup>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
