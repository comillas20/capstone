import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import { toast } from "@components/ui/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@components/ui/button";
import { mutate } from "swr";
import { deleteSet } from "../serverActions";
import { useTransition } from "react";

type SetDeleteDialogProps = {
	rowData: {
		id: number;
		name: string;
		createdAt: string;
		updatedAt: string;
	};
	isRowSelected?: boolean;
};
export default function SetDeleteDialog({
	rowData,
	isRowSelected,
}: SetDeleteDialogProps) {
	const [isSaving, startSaving] = useTransition();
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant={"link"}
					size={"sm"}
					className={isRowSelected ? "text-primary-foreground" : ""}>
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle className="text-destructive">Delete</DialogTitle>
					<DialogDescription>Deleting {rowData.name}</DialogDescription>
					<div className="text-destructive">This action cannot be undo. Delete?</div>
					<div className="flex justify-end gap-4">
						<DialogClose asChild>
							<Button variant={"secondary"} type="button">
								Cancel
							</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button
								type="button"
								variant={"destructive"}
								onClick={() => {
									startSaving(async () => {
										const yeetedSet = await deleteSet(rowData.id);
										if (yeetedSet) {
											toast({
												title: "Success",
												description: rowData.name + " is successfully deleted!",
												duration: 5000,
											});
											mutate("dpGetAllDishes");

											mutate("spGetAllSets");
										}
									});
								}}
								disabled={isSaving}>
								Delete
							</Button>
						</DialogClose>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
