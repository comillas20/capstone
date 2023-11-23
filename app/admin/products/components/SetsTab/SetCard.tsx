import EditableButtonText from "@components/EditableButtonText";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import SetAddEditDialog from "./SetAddEditDialog";
import SubSetAddEditDialog from "./SubSetAddEditDialog";
import sub from "date-fns/sub";

type SetCardProps = {
	data: {
		id: number;
		name: string;
		createdAt: Date;
		updatedAt: Date;
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
	const [isEditSetOpen, setIsEditSetOpen] = useState(false);
	const [isAddSubSetOpen, setIsAddSubSetOpen] = useState(false);
	const [isEditSubSetOpen, setIsEditSubSetOpen] = useState(false);
	const editSetNameData = data && { id: data?.id, name: data?.name };

	const subsetsByCourses: { [key: string]: typeof data.subSets } = {};
	data.subSets.forEach(subSet => {
		const key = subSet.course.id + "_" + subSet.course.name;

		if (!subsetsByCourses[key]) {
			subsetsByCourses[key] = [];
		}
		subsetsByCourses[key].push(subSet);
	});
	return (
		<Card className="col-span-4">
			<CardHeader className="text-center">
				<CardTitle className="flex items-center justify-center gap-2 text-2xl">
					<EditableButtonText
						text={data?.name}
						variant={"link"}
						className="p-0 text-2xl"
						iconClassName="text-primary"
						onClick={() => setIsEditSetOpen(true)}
					/>
					{editSetNameData && (
						<SetAddEditDialog
							editSetNameData={editSetNameData}
							open={isEditSetOpen}
							onOpenChange={setIsEditSetOpen}
						/>
					)}
				</CardTitle>
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
									<div key={subset.id}>
										{subSets && (
											<SubSetAddEditDialog editSubSetData={subset} setID={data.id}>
												<EditableButtonText
													text={subset.name}
													variant={"link"}
													className="mb-2 p-0 text-lg font-medium"
													iconClassName="text-primary"
													iconSize={20}
												/>
											</SubSetAddEditDialog>
										)}
										<div className="flex flex-col gap-1">
											{subset.dishes.map(dish => (
												<span>{dish.name}</span>
											))}
										</div>
									</div>
								))}
							</div>
						);
					})}

				{data && (
					<SubSetAddEditDialog setID={data?.id}>
						<Button variant={"link"} className="flex items-center hover:no-underline">
							<h2 className="font-medium">Create subset</h2>
							<PlusCircleIcon className="ml-2" />
						</Button>
					</SubSetAddEditDialog>
				)}
			</CardContent>
		</Card>
	);
}
