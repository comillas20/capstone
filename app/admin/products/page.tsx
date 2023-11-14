import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { RecentClients } from "../components/RecentClients";
import { Sales } from "../components/Sales";

export default function ProductsPage() {
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
			<TabsContent
				value="dishes"
				className="flex flex-col space-y-4 md:block"></TabsContent>
			<TabsContent value="sets"></TabsContent>
		</Tabs>
	);
}
