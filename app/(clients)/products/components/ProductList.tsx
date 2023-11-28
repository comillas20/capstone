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

type ProductListProps = {
	categories: {
		id: number;
		name: string;
	}[];
	dishes: {
		id: number;
		name: string;
		price: number;
		imgHref: string | null;
		category: {
			id: number;
			name: string;
		};
		course: {
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
			<div className="grid flex-1 grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
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
							className="flex h-fit w-full flex-col drop-shadow-md hover:drop-shadow-xl">
							<CardContent className="flex flex-1 items-center justify-center p-0">
								<ImageNotAvailable className="bottom-0 left-0 right-0 top-0 h-60 w-full">
									{dish.imgHref && (
										<CldImage
											width="200"
											height="240"
											src={dish.imgHref}
											sizes="100vw"
											alt={dish.name}
											className="bottom-0 left-0 right-0 top-0 h-60 w-full rounded-t-md"
										/>
									)}
								</ImageNotAvailable>
							</CardContent>
							<Separator></Separator>
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
