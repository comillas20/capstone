import ProductList from "./components/ProductList";
import prisma from "@lib/db";
export function generateMetadata() {
	return {
		title: "Products | Jakelou",
	};
}
export default async function ProductPage() {
	const allDishes = await prisma.dish.findMany({
		select: {
			id: true,
			name: true,
			category: true,
			imgHref: true,
		},
		where: {
			isAvailable: true,
		},
	});
	const allCategory = await prisma.category.findMany();
	return <ProductList dishes={allDishes} categories={allCategory} />;
}
