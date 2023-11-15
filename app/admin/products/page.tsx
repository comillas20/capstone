import { Separator } from "@components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import calamares from "@app/sample/items/calamares.jpg";
import Image from "next/image";
import { Dishes, columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import prisma from "@lib/db";
import { convertDateToString } from "@lib/utils";

async function getData(): Promise<Dishes[]> {
	// Fetch data from your API here.
	const dishes = await prisma.dish.findMany({
		select: {
			id: true,
			name: true,
			category: {
				select: {
					id: true,
					name: true,
				},
			},
			course: true,
			createdAt: true,
			updatedAt: true,
			isAvailable: true,
			price: true,
		},
	});

	return dishes.map(dish => ({
		id: dish.id,
		name: dish.name,
		category: dish.category.name,
		course: dish.course.name,
		createdAt: convertDateToString(dish.createdAt),
		updatedAt: convertDateToString(dish.updatedAt),
		isAvailable: dish.isAvailable ? "Available" : "N/A",
		price: dish.price,
	}));
}

export default async function ProductsPage() {
	const data = await getData();
	return (
		<Tabs defaultValue="dishes" className="space-y-4">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Products</h2>
				<TabsList className="bg-primary text-primary-foreground">
					<TabsTrigger value="dishes">Dishes</TabsTrigger>
					<TabsTrigger value="sets">Sets</TabsTrigger>
					<TabsTrigger value="services">Services</TabsTrigger>
				</TabsList>
			</div>
			<Separator></Separator>
			<TabsContent value="dishes" className="flex space-y-4">
				<div className="flex-1">
					<div className="w-60">
						<Image
							src={calamares}
							alt={"calamares"}
							className="bottom-0 left-0 right-0 top-0 h-60 w-full rounded-t-md"></Image>
					</div>
				</div>

				<Separator orientation="vertical" className="mx-12 h-auto" />
				<div>
					<DataTable columns={columns} data={data} />
				</div>
			</TabsContent>
			<TabsContent value="sets"></TabsContent>
		</Tabs>
	);
}
