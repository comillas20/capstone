import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@components/ui/dialog";
import { Services } from "./Columns";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@components/ui/button";
import { useTransition } from "react";
import { useSWRConfig } from "swr";
import { deleteServices } from "../serverActions";
import { toast } from "@components/ui/use-toast";
import { PRODUCTS_SERVICES_KEY } from "../ProductPageProvider";
import { Loader2 } from "lucide-react";

type DeleteDialogProps = {
	data: Services[];
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
						{data.length > 1 ? "selected services" : data[0] ? data[0].name : "ERROR"}
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
									startSaving(async () => {
										const ids = data.map(service => service.id);
										const submitDish = await deleteServices(ids);
										if (submitDish) {
											const plural =
												data.length > 1
													? "The selected services are"
													: data[0].name + " is";
											toast({
												title: "Success",
												description: plural + " successfully deleted!",
												duration: 5000,
											});
											mutate(PRODUCTS_SERVICES_KEY);
										}
									});
									onOpenChange(false);
								}}
								disabled={isSaving}>
								{isSaving && <Loader2 className="mr-2" />}
								Delete
							</Button>
						</DialogClose>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
