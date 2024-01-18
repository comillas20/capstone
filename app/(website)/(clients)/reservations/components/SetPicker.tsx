"use client";

import { getAllSets } from "@app/(website)/serverActionsGlobal";
import { Button } from "@components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useContext, useState } from "react";
import useSWR from "swr";
import SetCards from "./SetCards";
import {
	ReservationFormContext,
	ReservationFormContextProps,
} from "./ReservationForm";
export default function SetPicker() {
	const [selectedSet, setSelectedSet] = useState(0);
	const [selectedDishIDs, setSelectedDishIDs] = useState<
		{ subSetName: string; dishID: number }[]
	>([]);
	const { selectedVenue } = useContext(
		ReservationFormContext
	) as ReservationFormContextProps;
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

	if (!allSets.data) return <Loader2 className="animate-spin" />;
	else {
		const filteredSetByVenue = allSets.data.filter(
			set => set.venue.id === selectedVenue.id
		);
		return (
			<div className="grid flex-1 grid-cols-[1fr_auto_1fr] gap-4 rounded-sm border">
				{/* Left Button */}
				{filteredSetByVenue && filteredSetByVenue.length > 1 ? (
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
				) : (
					<div></div>
				)}
				{/* Sets to chose from */}
				{filteredSetByVenue && filteredSetByVenue.length !== 0 && (
					<SetCards
						key={filteredSetByVenue[selectedSet].id}
						set={filteredSetByVenue[selectedSet]}
						selectedDishIDs={selectedDishIDs}
						setSelectedDishIDs={setSelectedDishIDs}
						isThisSelected
					/>
				)}

				{/* Right Button */}
				{filteredSetByVenue && filteredSetByVenue.length > 1 ? (
					<Button
						className="h-full self-center rounded-s-none"
						onClick={() => {
							if (filteredSetByVenue && selectedSet < filteredSetByVenue.length - 1) {
								setSelectedSet(selectedSet + 1);
								setSelectedDishIDs([]);
							}
						}}
						disabled={selectedSet === filteredSetByVenue.length - 1}>
						<ChevronRight className="h-96" />
					</Button>
				) : (
					<div></div>
				)}
			</div>
		);
	}
}
