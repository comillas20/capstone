import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { useEffect } from "react";

type SetCardsProps = {
	set: {
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
	setSelectedDishIDs: React.Dispatch<
		React.SetStateAction<{ subSetName: string; dishID: number }[]>
	>;
	isThisSelected?: boolean;
	setPrerequisiteToDialog: React.Dispatch<React.SetStateAction<number>>;
};

export default function SetCards({
	set,
	setSelectedDishIDs,
	isThisSelected,
	setPrerequisiteToDialog,
}: SetCardsProps) {
	//a dictionary where subsets are sorted by courses
	const subsetsByCourses: { [key: string]: typeof set.subSets } = {};
	set.subSets.forEach(subSet => {
		const key = subSet.course.id + "_" + subSet.course.name;

		if (!subsetsByCourses[key]) {
			subsetsByCourses[key] = [];
		}
		subsetsByCourses[key].push(subSet);
	});

	useEffect(() => {
		setPrerequisiteToDialog(set.subSets.length);
	}, [set]);

	return (
		<Card className="w-full border-none">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">{set.name}</CardTitle>
				<p className="text-muted-foreground">Choose one from each category</p>
			</CardHeader>
			<CardContent className="flex flex-col justify-center gap-x-16 gap-y-4 lg:flex-row">
				{Object.keys(subsetsByCourses).map(key => {
					const [courseID, courseName] = key.split("_");
					const subSets = subsetsByCourses[key];
					return (
						<div
							key={courseID}
							className="flex flex-row flex-wrap justify-around gap-8">
							{subSets
								.filter(subset => subset.dishes.length !== 0)
								.map(subSet => (
									<div key={subSet.id}>
										<h3 className="text-xs font-medium">{courseName}</h3>
										<h2 className="mb-2 text-lg font-semibold">{subSet.name}</h2>
										<RadioGroup
											disabled={!isThisSelected}
											onValueChange={e => {
												const [ssName, dID] = e.split("_jin_");
												setSelectedDishIDs(selectedDishes => {
													const doesExistAlready = selectedDishes
														.map(dish => dish.subSetName)
														.includes(ssName);
													return !doesExistAlready
														? [
																...selectedDishes,
																{ subSetName: ssName, dishID: parseInt(dID) },
														  ]
														: selectedDishes.map(dish =>
																dish.subSetName === ssName
																	? { ...dish, dishID: parseInt(dID) }
																	: dish
														  );
												});
											}}
											defaultValue="none">
											{subSet.dishes.map(dish => (
												<Label
													key={dish.id.toString()}
													className="flex items-center space-x-2">
													<RadioGroupItem
														value={subSet.name + "_jin_" + dish.id.toString()}
													/>
													<span>{dish.name}</span>
												</Label>
											))}
										</RadioGroup>
									</div>
								))}
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
