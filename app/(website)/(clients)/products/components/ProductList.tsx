"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { useState } from "react";
import ProductFilters from "./ProductFilters";
import { CldImage } from "next-cloudinary";
import ImageNotAvailable from "@components/ImageNotAvailable";
import DishProfileDialog from "@components/DishProfileDialog";

type ProductListProps = {
	categories: {
		id: number;
		name: string;
	}[];
	dishes: {
		id: number;
		name: string;
		imgHref: string | null;
		category: {
			id: number;
			name: string;
		};
	}[];
};

export default function ProductList({ categories, dishes }: ProductListProps) {
	const [query, setQuery] = useState("");
	const [filters, setFilters] = useState(new Set<string>());
	return (
		<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
			<ProductFilters
				categories={categories}
				setFilters={setFilters}
				setQuery={setQuery}
			/>
			<div className="flex flex-1 flex-wrap gap-4">
				{dishes
					.filter(dish => {
						// Cannot be attached to the return statement, idk why
						// but seperating it here as a variable and attaching it to the return statement
						// seems to work
						let categoryFilter =
							filters.size !== 0 ? filters.has(dish.category.name) : true;
						// Filters product if strings match the search query and the filter checkboxes
						return (
							dish.name.toLowerCase().includes(query.toLowerCase()) && categoryFilter
						);
					})
					.map(dish => (
						<Card
							key={dish.id}
							className="flex w-52 flex-col drop-shadow-md hover:drop-shadow-xl">
							<CardContent className="flex flex-1 items-center justify-center p-0">
								<ImageNotAvailable className="overflow-hidden" ratio={3 / 4}>
									{dish.imgHref && (
										<DishProfileDialog
											data={{
												name: dish.name,
												category: dish.category.name,
												imgHref: dish.imgHref,
											}}>
											<CldImage
												src={dish.imgHref}
												fill
												alt={dish.name}
												className="rounded-t-md object-cover transition-all hover:scale-105"
											/>
										</DishProfileDialog>
									)}
								</ImageNotAvailable>
							</CardContent>
							<Separator />
							<CardFooter className="flex-col rounded-b-lg bg-primary p-2 text-primary-foreground">
								<CardTitle className="w-full text-sm font-medium">
									{dish.name}
								</CardTitle>
								<CardDescription className="w-full text-sm font-light text-slate-200">
									{dish.category.name}
								</CardDescription>
							</CardFooter>
						</Card>
					))}
			</div>
		</div>
	);
}
