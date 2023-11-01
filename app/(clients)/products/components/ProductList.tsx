"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import ProductFilters from "./ProductFilters";

type ProductListProps = {
	categories: string[];
	sets: string[];
	products: {
		name: string;
		imghref: StaticImageData;
		category: string;
	}[];
};

export default function ProductList({
	categories,
	sets,
	products,
}: ProductListProps) {
	const [query, setQuery] = useState("");
	const [filters, setFilters] = useState(new Set<string>());
	return (
		<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
			<ProductFilters
				categories={categories}
				sets={sets}
				setFilters={setFilters}
				setQuery={setQuery}
			/>
			<div className="grid flex-1 grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
				{products
					.filter(product => {
						// Cannot be attached to the return statement, idk why
						// but seperating it here as a variable and attaching it to the return statement
						// seems to work
						let categoryFilter =
							filters.size !== 0 ? filters.has(product.category) : true;
						// Filters product if strings match the search query and the filter checkboxes
						return (
							product.name.toLowerCase().includes(query.toLowerCase()) &&
							categoryFilter
						);
					})
					.map((product, index) => (
						<Card
							key={product.name + index}
							className="flex h-fit w-full flex-col drop-shadow-md hover:drop-shadow-xl">
							<CardContent className="flex flex-1 items-center justify-center p-0">
								<Image
									src={product.imghref}
									alt={product.name}
									className="bottom-0 left-0 right-0 top-0 h-60 w-full rounded-t-md"></Image>
							</CardContent>
							<Separator></Separator>
							<CardFooter className="flex-col rounded-b-lg bg-primary p-2 text-primary-foreground">
								<CardTitle className="w-full text-sm font-medium">
									{product.name}
								</CardTitle>
								<CardDescription className="w-full text-sm font-light text-slate-200">
									{product.category}
								</CardDescription>
							</CardFooter>
						</Card>
					))}
			</div>
		</div>
	);
}
