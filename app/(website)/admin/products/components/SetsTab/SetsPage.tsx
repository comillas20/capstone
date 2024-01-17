"use client";
import SetCard from "./SetCard";
import { SetTable } from "./SetTable";
import { Sets, columns } from "./SetColumns";
import { DataTableToolbar } from "./DataTableToolbar";
import { convertDateToString } from "@lib/utils";
import { useContext, useEffect, useRef, useState } from "react";
import {
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";

export default function SetsPage() {
	const { sets } = useContext(ProductPageContext) as ProductPageContextProps;
	const [selectedSet, setSelectedSet] = useState(sets && sets[0]);
	const selectedSetIndex = useRef(0);

	// row order is not the same with the set order, so I have to find the set by name first
	function changeSet(rowData: Sets) {
		const isSetNotEmpty = sets && sets.length > 0;
		if (isSetNotEmpty) {
			const set = sets.find(set => set.name === rowData.name) ?? "N/A";
			const setIndex =
				sets && sets.length != 0
					? sets.findIndex(set => set.name === rowData.name)
					: -1;
			if (set !== "N/A") {
				selectedSetIndex.current =
					setIndex !== -1 ? setIndex : selectedSetIndex.current;
				setSelectedSet(set);
			}
		}
	}
	const setTable: Sets[] = sets
		? sets.map(set => ({
				id: set.id,
				name: set.name,
				createdAt: convertDateToString(set.createdAt),
				updatedAt: convertDateToString(set.updatedAt),
				minimumPerHead: set.minimumPerHead,
				price: set.price,
		  }))
		: [];

	// Note to self: THIS IS NECESSARY
	// takes care of changes to set card, like set name, description, etc.
	useEffect(() => {
		if (sets) setSelectedSet(sets[selectedSetIndex.current]);
	}, [sets]);
	return (
		<div>
			{sets && (
				<div className="grid gap-6 pt-4 xl:grid-cols-12">
					{sets && selectedSet ? (
						<SetCard data={selectedSet} className="xl:col-span-5" />
					) : (
						<div className="xl:col-span-5"></div>
					)}
					<div className="xl:col-span-7">
						<SetTable
							data={setTable}
							columns={columns}
							Toolbar={DataTableToolbar}
							onSetChange={changeSet}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
