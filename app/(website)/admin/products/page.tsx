import { Separator } from "@components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import DishesPage from "./components/DishesTab/DishesPage";
import SetsPage from "./components/SetsTab/SetsPage";
import ProductPageProvider from "./components/ProductPageProvider";
import OtherServicesPage from "./components/OtherServices/OtherServicesPage";
export default async function ProductsPage() {
	return (
		<Tabs defaultValue="dishes" className="space-y-4">
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Products</h2>
					<p className="text-muted-foreground">
						Manage dishes, sets, and other services
					</p>
				</div>
				<TabsList className="bg-primary text-primary-foreground">
					<TabsTrigger value="dishes">Dishes</TabsTrigger>
					<TabsTrigger value="sets">Sets</TabsTrigger>
					<TabsTrigger value="otherServices">Other Services</TabsTrigger>
				</TabsList>
			</div>
			<Separator></Separator>

			<ProductPageProvider>
				<TabsContent value="dishes">
					<DishesPage />
				</TabsContent>
				<TabsContent value="sets">
					<SetsPage />
				</TabsContent>
				<TabsContent value="otherServices">
					<OtherServicesPage />
				</TabsContent>
			</ProductPageProvider>
		</Tabs>
	);
}
