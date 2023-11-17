import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

type SetCardProps = {
	id: number;
	name: string;
	subSets: {
		name: string;
		dishes: {
			id: number;
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
};
export default function SetCard({ id, name, subSets }: SetCardProps) {
	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">{name}</CardTitle>
				<p className="text-muted-foreground">Choose one from each category</p>
			</CardHeader>
			<CardContent className="flex flex-col justify-around gap-4">
				{/* {categoriesWithDishes.map(category => (
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
				))} */}
			</CardContent>
		</Card>
	);
}
