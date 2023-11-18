import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { PlusCircleIcon } from "lucide-react";

type SetCardProps = {
	data?: {
		id: number;
		name: string;
		subSets: {
			id: number;
			name: string;
			dishes: {
				id: number;
				name: string;
				isAvailable: boolean;
				price: number;
				category: {
					id: number;
					name: string;
				};
			}[];
			course: {
				id: number;
				name: string;
			};
		}[];
	};
};
export default function SetCard({ data }: SetCardProps) {
	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">{data?.name}</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-2 gap-4">
				{data && data.subSets.length !== 0 ? (
					data.subSets.map(subset => (
						<div key={subset.id}>
							<h2 className="mb-2 text-lg font-medium">{subset.name}</h2>
							<div className="flex flex-col gap-1">
								{subset.dishes.map(dish => (
									<span>{dish.name}</span>
								))}
							</div>
						</div>
					))
				) : (
					<Button variant={"link"} className="flex items-center hover:no-underline">
						<h2 className="text-lg font-medium">Create subset</h2>
						<PlusCircleIcon className="ml-2" />
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
