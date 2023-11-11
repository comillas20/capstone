import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Label } from "@components/ui/label";

type SetCardsProps = {
	title: string;
	products: {
		category: string;
		course: string;
		dishes: string[];
	}[];
	selected?: boolean;
	selectProducts: (category: string, course: string, dish: string) => void;
};

export default function SetCards({
	title,
	products,
	selected,
	selectProducts,
}: SetCardsProps) {
	return (
		<Card className="w-full border-none">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">{title}</CardTitle>
				<p className="text-muted-foreground">Choose one from each category</p>
			</CardHeader>
			<CardContent className="flex flex-row justify-around gap-4">
				{products.map(product => (
					<div key={product.category}>
						<h2 className="mb-2 text-lg">{product.category}</h2>
						<RadioGroup
							key={title.concat(product.category)}
							disabled={!selected}
							onValueChange={e => selectProducts(product.category, product.course, e)}
							defaultValue="none">
							{product.dishes.map(dish => (
								<Label key={dish} className="flex items-center space-x-2">
									<RadioGroupItem value={dish} />
									<span>{dish}</span>
								</Label>
							))}
						</RadioGroup>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
