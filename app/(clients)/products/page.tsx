"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import Image from "next/image";
import bam_i from "@app/sample/items/bam_i.jpg";
import buko_pandan from "@app/sample/items/buko_pandan.jpg";
import calamares from "@app/sample/items/calamares.jpg";
import { useState } from "react";
import { Input } from "@components/ui/input";

//sample data
const prod = [
	{
		name: "Bam - I",
		imghref: bam_i,
		category: "Canton",
	},
	{
		name: "Buko Pandan",
		imghref: buko_pandan,
		category: "Dessert",
	},
	{
		name: "Calamares",
		imghref: calamares,
		category: "Fish",
	},
	{
		name: "Bam - I",
		imghref: bam_i,
		category: "Canton",
	},
	{
		name: "Buko Pandan",
		imghref: buko_pandan,
		category: "Dessert",
	},
	{
		name: "Calamares",
		imghref: calamares,
		category: "Fish",
	},
	{
		name: "Bam - I",
		imghref: bam_i,
		category: "Canton",
	},
	{
		name: "Buko Pandan",
		imghref: buko_pandan,
		category: "Dessert",
	},
	{
		name: "Calamares",
		imghref: calamares,
		category: "Fish",
	},
];

export default function ProductListPage() {
	const [query, setQuery] = useState("");
	return (
		<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
			<aside className="border-b border-primary  lg:w-1/6 lg:border-b-0">
				<div className="sticky top-0 mb-8 flex space-x-2 pt-12 lg:mb-0 lg:flex-col lg:space-x-0 lg:space-y-1">
					<Input
						className="mb-0 w-[200px] border border-foreground lg:mb-8 lg:w-full"
						placeholder="Search"
						onChange={e => setQuery(e.target.value)}
					/>
					<span>filters</span>
					<span>filters</span>
					<span>filters</span>
				</div>
			</aside>
			<div className="grid flex-1 grid-cols-3 gap-4 md:grid-cols-5">
				{prod
					.filter(products =>
						products.name.toLowerCase().includes(query.toLowerCase())
					)
					.map((products, index) => (
						<Card
							key={products.name + index}
							className="flex w-full flex-col drop-shadow-md hover:drop-shadow-xl">
							<CardContent className="flex flex-1 items-center justify-center p-0">
								<Image
									src={products.imghref}
									alt={products.name}
									className="bottom-0 left-0 right-0 top-0 h-full max-h-60 w-full rounded-t-md"></Image>
							</CardContent>
							<Separator></Separator>
							<CardFooter className="flex-col rounded-b-lg bg-primary p-2 text-primary-foreground">
								<CardTitle className="w-full text-sm font-medium">
									{products.name}
								</CardTitle>
								<CardDescription className="w-full text-sm font-light text-slate-200">
									{products.category}
								</CardDescription>
							</CardFooter>
						</Card>
					))}
			</div>
		</div>
	);
}
