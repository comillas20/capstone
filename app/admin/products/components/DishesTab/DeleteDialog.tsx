import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@components/ui/dialog";
import { Dishes } from "./Columns";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@components/ui/button";
import { useTransition } from "react";
import { useSWRConfig } from "swr";
import { deleteDishes } from "../serverActions";
import { toast } from "@components/ui/use-toast";

type DeleteDialogProps = {
	data: Dishes;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
} & React.ComponentProps<typeof Dialog>;

export default function DeleteDialog({
	data,
	open,
	onOpenChange,
}: DeleteDialogProps) {
	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle className="text-destructive">Delete</DialogTitle>
					<DialogDescription>Deleting {data.name}</DialogDescription>
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
									onOpenChange(false);
									startSaving(async () => {
										const submitDish = await deleteDishes([data.id]);
										if (submitDish) {
											toast({
												title: "Success",
												description: "The dish is successfully deleted!",
												duration: 5000,
											});
											mutate("dpGetAllDishes");
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
