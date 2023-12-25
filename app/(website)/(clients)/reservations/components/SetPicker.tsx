"use client";

import { getAllSets } from "@app/(website)/serverActionsGlobal";
import { Button } from "@components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import SetCards from "./SetCards";
export default function SetPicker() {
	const [selectedSet, setSelectedSet] = useState(0);
	const [selectedDishIDs, setSelectedDishIDs] = useState<
		{ subSetName: string; dishID: number }[]
	>([]);
	const allSets = useSWR("spickerGetAllSets", async () => {
		const sets = await getAllSets();
		const filtered = sets
			.map(({ subSets, ...set }) => ({
				...set,
				subSets: subSets
					.map(({ dishes, ...subSet }) => ({
						...subSet,
						dishes: dishes.filter(dish => dish.isAvailable),
					}))
					.filter(subSet => subSet.dishes.length > 0),
			}))
			.filter(set => set.subSets.length > 0);

		return filtered;
	});
	return (
		<div className="grid flex-1 grid-cols-[1fr_auto_1fr] gap-4 rounded-sm border">
			{/* Left Button */}
			{allSets.data && allSets.data.length > 1 && (
				<Button
					className="h-full self-center rounded-e-none"
					onClick={() => {
						if (selectedSet > 0) {
							setSelectedSet(selectedSet - 1);
							setSelectedDishIDs([]);
						}
					}}
					disabled={selectedSet === 0}>
					<ChevronLeft className="h-96" />
				</Button>
			)}
			{/* Sets to chose from */}
			{allSets.data && allSets.data.length !== 0 && (
				<SetCards
					set={allSets.data[selectedSet]}
					selectedDishIDs={selectedDishIDs}
					setSelectedDishIDs={setSelectedDishIDs}
					isThisSelected
				/>
			)}

			{/* Right Button */}
			{allSets.data && allSets.data.length > 1 && (
				<Button
					className="h-full self-center rounded-s-none"
					onClick={() => {
						if (allSets.data && selectedSet < allSets.data.length - 1) {
							setSelectedSet(selectedSet + 1);
							setSelectedDishIDs([]);
						}
					}}
					disabled={selectedSet === allSets.data.length - 1}>
					<ChevronRight className="h-96" />
				</Button>
			)}
		</div>
	);
}
