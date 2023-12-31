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
import { useTransition } from "react";
import { Button } from "@components/ui/button";
import { mutate } from "swr";
import { deleteSubset } from "../serverActions";
import { PRODUCTS_SETS_KEY } from "../ProductPageProvider";

export default function SubSetDeleteDialog({
	subSet,
	children,
}: {
	subSet: { id: number; name: string };
	children: React.ReactElement;
}) {
	const [isSaving, startSaving] = useTransition();

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle className="text-destructive">Delete</DialogTitle>
					<DialogDescription>Deleting {subSet.name}</DialogDescription>
					<div className="text-destructive">
						This action is not reversable. Continue?
					</div>
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
										const submitDish = await deleteSubset(subSet.id);
										if (submitDish) {
											toast({
												title: "Success",
												description: subSet.name + " is successfully deleted!",
												duration: 5000,
											});
										}

										mutate(PRODUCTS_SETS_KEY);
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
