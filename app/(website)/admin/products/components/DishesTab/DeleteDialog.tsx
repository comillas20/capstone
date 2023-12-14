import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@components/ui/dialog";
import { Dishes } from "./DishColumns";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@components/ui/button";
import { useTransition } from "react";
import { useSWRConfig } from "swr";
import { deleteDishes } from "../serverActions";
import { toast } from "@components/ui/use-toast";
import { PRODUCTS_DISHES_KEY } from "../ProductPageProvider";

type DeleteDialogProps = {
	data: Dishes[];
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
					<DialogDescription>
						Deleting{" "}
						{data.length > 1 ? "selected dishes" : data[0] ? data[0].name : "ERROR"}
					</DialogDescription>
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
									const toBeYeeted: { id: number; imgHref: string | null }[] = data.map(
										d => ({
											id: d.id,
											imgHref: d.imgHref,
										})
									);
									startSaving(async () => {
										const submitDish = await deleteDishes(toBeYeeted);
										if (submitDish) {
											toast({
												title: "Success",
												description: "The dish is successfully deleted!",
												duration: 5000,
											});
											mutate(PRODUCTS_DISHES_KEY);
										}
									});
									onOpenChange(false);
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
