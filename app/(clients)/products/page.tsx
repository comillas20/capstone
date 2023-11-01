import ProductList from "./components/ProductList";
import bam_i from "@app/sample/items/bam_i.jpg";
import buko_pandan from "@app/sample/items/buko_pandan.jpg";
import calamares from "@app/sample/items/calamares.jpg";

//sample data
const products = [
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
	{
		name: "Nemo",
		imghref: calamares,
		category: "Fish",
	},
];

const categories = ["Fish", "Dessert", "Chicken", "Canton"];
const sets = ["Set A", "Set B", "Set C", "Set D"];
export function generateMetadata() {
	return {
		title: "Products | Jakelou",
	};
}
export default function ProductPage() {
	return <ProductList products={products} categories={categories} sets={sets} />;
}
