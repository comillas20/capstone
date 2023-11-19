"use client";
import useSWR, { mutate } from "swr";
import { deleteSubsets, getAllSets } from "../serverActions";
import SetCard from "./SetCard";
import { Button } from "@components/ui/button";
import { useTransition } from "react";
import { toast } from "@components/ui/use-toast";
import { PlusCircleIcon } from "lucide-react";
import { DataTable } from "@app/admin/components/DataTable";

export default function SetsPage() {
	const allSets = useSWR("spGetAllSets", getAllSets, {
		revalidateOnReconnect: true,
	});
	return (
		<div className="flex flex-col space-y-2">
			<div className="flex justify-end"></div>
			{allSets.data && (
				<div className="flex gap-6 pt-4">
					{/* <DataTable data={allSets.data} /> */}
					<SetCard data={allSets.data && allSets.data[0]} />
				</div>
			)}
		</div>
	);
}
