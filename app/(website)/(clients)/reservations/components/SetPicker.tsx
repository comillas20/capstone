"use client";

import { getAllSets } from "@app/(website)/serverActionsGlobal";
import { Button } from "@components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContext, useState } from "react";
import useSWR from "swr";
import SetCards from "./SetCards";
import {
	ReservationFormContext,
	ReservationFormContextProps,
} from "./ReservationForm";

export default function SetPicker() {
	const { setSelectedDishIDs } = useContext(
		ReservationFormContext
	) as ReservationFormContextProps;
	const [selectedSet, setSelectedSet] = useState(0);
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
				<SetCards set={allSets.data[selectedSet]} isThisSelected />
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
