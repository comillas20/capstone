"use client";
import useSWR, { mutate } from "swr";
import { deleteSubsets, getAllSets } from "../serverActions";
import SetCard from "./SetCard";
import { Button } from "@components/ui/button";
import { useTransition } from "react";
import { toast } from "@components/ui/use-toast";
import { PlusCircleIcon } from "lucide-react";

export default function SetsPage() {
	const allSets = useSWR("spGetAllSets", getAllSets, {
		revalidateOnReconnect: true,
	});
	const [isSaving, startSaving] = useTransition();
	return (
		<div className="flex flex-col space-y-2">
			<div className="flex justify-end">
				<Button
					onClick={() => {
						startSaving(async () => {
							const submitDish = await deleteSubsets();
							if (submitDish) {
								toast({
									title: "Success",
									description: "The dish is successfully deleted!",
									duration: 5000,
								});
								mutate("spGetAllSets");
							}
						});
					}}
					disabled={isSaving}>
					<PlusCircleIcon className="mr-2" />
					New set
				</Button>
			</div>
			<div className="flex gap-6 pt-4">
				<SetCard data={allSets.data && allSets.data[0]} />
			</div>
		</div>
	);
}
