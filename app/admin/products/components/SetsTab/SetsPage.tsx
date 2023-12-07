"use client";
import useSWR from "swr";
import { getAllSets } from "../serverActions";
import SetCard from "./SetCard";
import { DataTable } from "@app/admin/components/DataTable";
import { Sets, columns } from "./SetColumns";
import { DataTableToolbar } from "./DataTableToolbar";
import { convertDateToString } from "@lib/utils";
import { useEffect, useRef, useState } from "react";

type set = {
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
export default function SetsPage() {
	const allSets = useSWR("spGetAllSets", getAllSets);
	const [selectedSet, setSelectedSet] = useState(
		allSets.data && allSets.data[0]
	);
	const selectedSetIndex = useRef(0);

	function changeSet(rowData: Sets) {
		const set =
			allSets.data && allSets.data.length != 0
				? allSets.data.find(set => set.name === rowData.name)
				: "N/A";
		const setIndex =
			allSets.data && allSets.data.length != 0
				? allSets.data.findIndex(set => set.name === rowData.name)
				: -1;
		if (set !== "N/A") {
			selectedSetIndex.current =
				setIndex !== -1 ? setIndex : selectedSetIndex.current;
			setSelectedSet(set);
		}
	}
	const setTable: Sets[] = allSets.data
		? allSets.data.map(set => ({
				id: set.id,
				name: set.name,
				createdAt: convertDateToString(set.createdAt),
				updatedAt: convertDateToString(set.updatedAt),
		  }))
		: [];

	useEffect(() => {
		if (allSets.data) setSelectedSet(allSets.data[selectedSetIndex.current]);
	}, [allSets.data]);

	return (
		<div>
			{allSets.data && (
				<div className="grid grid-cols-12 gap-6 pt-4 ">
					{allSets.data && selectedSet && <SetCard data={selectedSet} />}
					<div className="col-span-7">
						<DataTable
							data={setTable}
							columns={columns}
							Toolbar={DataTableToolbar}
							selectFirstRowAsDefault
							singleSelection={changeSet}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
