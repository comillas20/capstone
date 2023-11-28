"use client";

import { getAllSets } from "@app/(clients)/clientServerActions";
import { Button } from "@components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import SetCards from "./SetCards";

type SetPickerProps = {
	setSelectedDishIDs: React.Dispatch<
		React.SetStateAction<{ subSetName: string; dishID: number }[]>
	>;
	setPrerequisiteToDialog: React.Dispatch<React.SetStateAction<number>>;
};
export default function SetPicker({
	setSelectedDishIDs,
	setPrerequisiteToDialog,
}: SetPickerProps) {
	const [selectedSet, setSelectedSet] = useState(0);
	const allSets = useSWR("spickerGetAllSets", async () => {
		const sets = await getAllSets();
		return sets.filter(set =>
			set.subSets.some(subSet => subSet.dishes.length > 0)
		);
	});

	return (
		<div className="mb-14 flex justify-between gap-4 rounded-sm border">
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
					setSelectedDishIDs={setSelectedDishIDs}
					setPrerequisiteToDialog={setPrerequisiteToDialog}
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
