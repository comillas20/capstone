import EditableButtonText from "@components/EditableButtonText";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import SetAddEditDialog from "./SetAddEditDialog";
import SubSetAddEditDialog from "./SubSetAddEditDialog";

type SetCardProps = {
	data: {
		id: number;
		name: string;
		description: string | null;
		minimumPerHead: number;
		price: number;
		createdAt: Date;
		updatedAt: Date;
		selectionQuantity: number;
		venue: {
			id: number;
			name: string;
			freeHours: number;
			location: string;
			maxCapacity: number;
			venueCost: number;
		};
		subSets: {
			id: number;
			name: string;
			dishes: {
				id: number;
				name: string;
				isAvailable: boolean;
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
	className?: string;
};
export default function SetCard({ data, className }: SetCardProps) {
	const [isEditSetOpen, setIsEditSetOpen] = useState(false);
	const editSetData = data && {
		id: data.id,
		name: data.name,
		description: data.description,
		minimumPerHead: data.minimumPerHead,
		price: data.price,
		selectionQuantity: data.selectionQuantity,
		venueID: data.venue.id,
	};

	const subsetsByCourses: { [key: string]: typeof data.subSets } = {};
	data.subSets.forEach(subSet => {
		const key = subSet.course.id + "_" + subSet.course.name;

		if (!subsetsByCourses[key]) {
			subsetsByCourses[key] = [];
		}
		subsetsByCourses[key].push(subSet);
	});
	return (
		<Card className={className} key={data.id}>
			<CardHeader className="text-center">
				<CardTitle className="flex items-center justify-center gap-2">
					<EditableButtonText
						key={data.name}
						text={data.name}
						variant={"link"}
						className="p-0 text-2xl"
						iconClassName="text-primary"
						onClick={() => setIsEditSetOpen(true)}
					/>
					{editSetData && (
						<SetAddEditDialog
							key={editSetData.id}
							editSetData={editSetData}
							open={isEditSetOpen}
							onOpenChange={setIsEditSetOpen}
						/>
					)}
				</CardTitle>
				{data.description && (
					<p className="text-muted-foreground">{data.description}</p>
				)}
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{data &&
					Object.keys(subsetsByCourses).map(key => {
						const [courseID, courseName] = key.split("_");
						const subSets = subsetsByCourses[key];
						return (
							<div key={courseID} className="mb-2 grid grid-cols-2 gap-x-4">
								<h5 className="col-span-2 text-primary">{courseName}</h5>
								{subSets.map(subset => (
									<div key={subset.id} className="mb-3">
										{subSets && (
											<SubSetAddEditDialog
												editSubSetData={subset}
												setID={data.id}
												key={subset.id}>
												<EditableButtonText
													text={subset.name}
													variant={"link"}
													className="p-0 text-lg font-medium"
													iconClassName="text-primary"
													iconSize={20}
												/>
											</SubSetAddEditDialog>
										)}
										<div className="flex flex-col gap-1">
											{subset.dishes.map(dish => (
												<span key={dish.id}>{dish.name}</span>
											))}
										</div>
									</div>
								))}
							</div>
						);
					})}

				{data && (
					<SubSetAddEditDialog setID={data.id}>
						<Button variant={"link"} className="flex items-center hover:no-underline">
							<Plus className="mr-2" />
							<h2 className="font-medium">Create subset</h2>
						</Button>
					</SubSetAddEditDialog>
				)}
			</CardContent>
		</Card>
	);
}
