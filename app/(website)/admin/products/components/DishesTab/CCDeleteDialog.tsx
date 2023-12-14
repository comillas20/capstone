import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@components/ui/button";
import { useTransition } from "react";
import { useSWRConfig } from "swr";
import { deleteCategory, deleteCourse } from "../serverActions";
import { toast } from "@components/ui/use-toast";
import {
	PRODUCTS_CATEGORIES_KEY,
	PRODUCTS_COURSES_KEY,
	PRODUCTS_SETS_KEY,
} from "../ProductPageProvider";

type CCDeleteDialogProps = {
	data: {
		id: number;
		name: string;
	};
	isCategory: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
} & React.ComponentProps<typeof Dialog>;

export default function CCDeleteDialog({
	data,
	isCategory,
	open,
	onOpenChange,
}: CCDeleteDialogProps) {
	const [isSaving, startSaving] = useTransition();
	const { mutate } = useSWRConfig();

	const categoryMSG =
		"This action deletes all dishes under this category. Continue?";
	const courseMSG =
		"This action deletes all subsets under this course. Continue?";
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle className="text-destructive">Delete</DialogTitle>
					<DialogDescription>Deleting {data.name}</DialogDescription>
					<div className="text-destructive">
						{isCategory ? categoryMSG : courseMSG}
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
									onOpenChange(false);
									startSaving(async () => {
										const submitDish = isCategory
											? await deleteCategory(data.id)
											: await deleteCourse(data.id);
										if (submitDish) {
											toast({
												title: "Success",
												description: data.name + " is successfully deleted!",
												duration: 5000,
											});
											mutate(PRODUCTS_CATEGORIES_KEY);
											mutate(PRODUCTS_COURSES_KEY);
											mutate(PRODUCTS_SETS_KEY);
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
