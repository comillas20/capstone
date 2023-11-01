import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Label } from "@components/ui/label";
import { cn } from "@lib/utils";

type SetCardsProps = {
	title: string;
	products: {
		category: string;
		dishes: string[];
	}[];
	selected?: boolean;
	onClick?: () => void;
};
export function createSetCardsRadioItemID(productName: string) {
	return productName.toLowerCase().replace(" ", "_");
}
export default function SetCards({
	title,
	products,
	selected,
	onClick,
}: SetCardsProps) {
	return (
		<Card
			className={cn(
				"hidden w-full first:block hover:shadow-sm hover:shadow-primary min-[1450px]:block min-[1450px]:w-96 min-[1450px]:min-w-fit",
				selected && "outline outline-1 outline-primary hover:shadow-none"
			)}
			onClick={onClick}>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">{title}</CardTitle>
				<p className="text-muted-foreground">Choose one from each category</p>
			</CardHeader>
			<CardContent className="flex flex-row justify-between gap-4 min-[1450px]:flex-col min-[1450px]:justify-normal">
				{products.map(product => (
					<div
						key={product.category}
						className="min-[1450px]:mt-4 min-[1450px]:first:mt-0">
						<h2 className="mb-2 text-lg">{product.category}</h2>
						<RadioGroup disabled={!selected}>
							{product.dishes.map(dish => (
								<Label key={dish} className="flex items-center space-x-2">
									<RadioGroupItem value={createSetCardsRadioItemID(dish)} />
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
