import { getAllDishes } from "@app/(website)/serverActionsGlobal";
import { CheckboxGroup, CheckboxItem } from "@components/CheckBoxGroup";
import { Button } from "@components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@components/ui/card";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import ReservationDialog from "./ReservationDialog";
import { signIn } from "next-auth/react";
import {
	ReservationFormContext,
	ReservationFormContextProps,
} from "./ReservationForm";
import { getALlDishesWithCourses } from "../serverActions";
import { Separator } from "@components/ui/separator";

type SetCardsProps = {
	set: {
		id: number;
		name: string;
		createdAt: Date;
		updatedAt: Date;
		minimumPerHead: number;
		price: number;
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
				imgHref: string | null;
			}[];
			course: {
				id: number;
				name: string;
			};
			selectionQuantity: number;
		}[];
	};
	isThisSelected?: boolean;
	selectedDishIDs: {
		subSetName: string;
		dishID: number;
	}[];
	setSelectedDishIDs: React.Dispatch<
		React.SetStateAction<
			{
				subSetName: string;
				dishID: number;
			}[]
		>
	>;
};

export default function SetCards({
	set,
	isThisSelected,
	setSelectedDishIDs,
	selectedDishIDs,
}: SetCardsProps) {
	const { session, currentDate, month, date } = useContext(
		ReservationFormContext
	) as ReservationFormContextProps;
	const allDishesNCourses = useSWR(
		"getALlDishesWithCourses",
		getALlDishesWithCourses
	);
	const [selectedDishIDsViaCB, setSelectedDishIDsViaCB] = useState<string[]>([]);
	const [prerequisiteToDialog, setPrerequisiteToDialog] = useState<number>(1);
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
	//a dictionary where subsets are sorted by courses
	const subsetsByCourses: { [key: string]: typeof set.subSets } = {};
	const sortByCourseID = set.subSets.sort((a, b) => a.course.id - b.course.id);
	sortByCourseID.forEach(subSet => {
		const key = subSet.course.id + "_" + subSet.course.name;

		if (!subsetsByCourses[key]) {
			subsetsByCourses[key] = [];
		}
		subsetsByCourses[key].push(subSet);
	});
	useEffect(() => {
		let counter = 0;
		set.subSets.forEach(subset => {
			//Note to self: selectionQuantity == 0 means all dishes are required
			//so I count them and include them in counter
			if (subset.selectionQuantity == 0) counter += subset.dishes.length;
			counter += subset.selectionQuantity;
		});
		setPrerequisiteToDialog(counter);
	}, [set]);

	return (
		<Card className="w-full border-none">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">{set.name}</CardTitle>
				<p className="text-muted-foreground">Choose one from each category</p>
			</CardHeader>
			<CardContent className="flex flex-col justify-center gap-x-16 gap-y-4">
				{Object.keys(subsetsByCourses).map(key => {
					const [courseID, courseName] = key.split("_");
					const subSets = subsetsByCourses[key];
					return (
						<div key={courseID} className="flex flex-col gap-y-2">
							<h3 className="text-xs font-medium">{courseName}</h3>
							<div className="grid grid-cols-2 gap-x-8 gap-y-4">
								{subSets
									.filter(subset => subset.dishes.length !== 0)
									.map(subSet => (
										<div key={subSet.id}>
											<h2 className="mb-2 h-[26px] text-lg font-semibold">
												{subSet.name}
											</h2>
											{subSet.selectionQuantity === 1 ? (
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
													}}>
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
											) : (
												<CheckboxGroup
													maxChecks={subSet.selectionQuantity}
													disabled={!isThisSelected}
													checkedValues={selectedDishIDsViaCB}
													setCheckedValues={setSelectedDishIDsViaCB}>
													{subSet.dishes.map(dish => (
														<CheckboxItem
															key={dish.id.toString()}
															value={subSet.name + "_jin_" + dish.id.toString()}
															children={dish.name}
														/>
													))}
												</CheckboxGroup>
											)}
										</div>
									))}
							</div>
						</div>
					);
				})}
			</CardContent>
			<Separator />
			{allDishesNCourses.data &&
				(() => {
					const selectedByCheckBoxes = selectedDishIDsViaCB.map(selectedIDs => {
						const [subSetName, dishID] = selectedIDs.split("_jin_");
						return { subSetName, dishID: parseInt(dishID) };
					});
					const mergedSelectedIDs = selectedDishIDs.concat(selectedByCheckBoxes);
					const allSelectedDishes = allDishesNCourses.data.filter(dish =>
						mergedSelectedIDs.map(d => d.dishID).includes(dish.id)
					);

					return (
						<CardFooter className="grid grid-cols-2 pt-6">
							<div className="text-sm">
								<p className="font-semibold">Rice and softdrinks are inclusive</p>
								<p className="font-bold text-destructive">
									Strictly no outside food/s allowed, except letchon, cake, and fruits
								</p>
							</div>
							<Button
								className="flex justify-self-end"
								disabled={mergedSelectedIDs.length < prerequisiteToDialog}
								onClick={() => {
									if (session?.user) {
										setIsPaymentDialogOpen(true);
									} else {
										signIn();
									}
								}}>
								Reserve
							</Button>
							{session && (
								<ReservationDialog
									selectedSet={set}
									selectedDishes={allSelectedDishes}
									open={isPaymentDialogOpen}
									onOpenChange={setIsPaymentDialogOpen}
									session={session}
								/>
							)}
						</CardFooter>
					);
				})()}
		</Card>
	);
}
