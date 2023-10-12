import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import Image from "next/image";
import bam_i from "@app/sample/items/bam_i.jpg";
import buko_pandan from "@app/sample/items/buko_pandan.jpg";
import calamares from "@app/sample/items/calamares.jpg";

//sample data
const prod = [
	{
		name: "Bam - e",
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
	return (
		<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
			<aside className="border-b border-r-0 border-primary lg:-mx-4 lg:w-1/6 lg:border-b-0 lg:border-r">
				<div className="flex space-x-2 pt-12 lg:flex-col lg:space-x-0 lg:space-y-1">
					<span>filters</span>
					<span>filters</span>
					<span>filters</span>
				</div>
			</aside>
			<div className="grid flex-1 grid-cols-3 gap-4 md:grid-cols-4">
				{prod.map(products => (
					<Card
						key={products.name}
						className="flex w-full flex-col border border-primary drop-shadow-md hover:drop-shadow-xl">
						<CardContent className="flex flex-1 items-center justify-center pt-6">
							<Image src={products.imghref} alt={products.name}></Image>
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
