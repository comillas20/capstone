"use client";
import useSWR, { mutate } from "swr";
import { getAllSets } from "../serverActions";
import SetCard from "./SetCard";
import { DataTable } from "@app/admin/components/DataTable";
import { Sets, columns } from "./SetColumns";
import { DataTableToolbar } from "./DataTableToolbar";
import { cn, convertDateToString } from "@lib/utils";
import { useEffect, useRef, useState } from "react";
import { Button } from "@components/ui/button";

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
	const allSets = useSWR("spGetAllSets", getAllSets, {
		revalidateOnReconnect: true,
	});
	const [selectedSet, setSelectedSet] = useState(
		allSets.data && allSets.data[0]
	);
	const selectedSetIndex = useRef(0);

	function changeSet(name: string) {
		const set =
			allSets.data && allSets.data.length != 0
				? allSets.data.find(set => set.name === name)
				: "N/A";
		const setIndex =
			allSets.data && allSets.data.length != 0
				? allSets.data.findIndex(set => set.name === name)
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

	const setColumns: typeof columns = columns.map(col => {
		const isSetName = col.id === "name";
		return isSetName
			? {
					id: col.id,
					accessorKey: "name",
					header: col.header,
					cell: ({ row, table }) => (
						<Button
							variant={"link"}
							className={cn(
								"select-none p-0",
								selectedSet?.name === row.getValue("name")
									? "text-primary-foreground"
									: ""
							)}
							onClick={() => {
								changeSet(row.getValue("name"));
								table.toggleAllRowsSelected(false);
								row.toggleSelected(true);
							}}
							disabled={row.getIsSelected()}>
							{row.getValue("name")}
						</Button>
					),
			  }
			: col;
	});

	useEffect(() => {
		if (allSets.data) setSelectedSet(allSets.data[selectedSetIndex.current]);
	}, [allSets.data]);

	return (
		<div>
			{allSets.data && (
				<div className="grid grid-cols-12 gap-6 pt-4 ">
					{allSets.data && selectedSet && <SetCard data={selectedSet} />}
					<div className="col-span-8">
						<DataTable
							data={setTable}
							columns={setColumns}
							Toolbar={DataTableToolbar}
							rowClassName="data-[state=selected]:bg-primary data-[state=selected]:text-primary-foreground"
							selectFirstRowAsDefault
						/>
					</div>
				</div>
			)}
		</div>
	);
}
