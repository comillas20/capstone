import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@components/ui/button";
type IrreversableConfirmationDialogProps = {
	title: string;
	description: string;
	message: string;
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	children: React.ReactElement<typeof Button>;
} & React.ComponentProps<typeof Button>;
export default function IrreversableConfirmationDialog({
	title,
	description,
	message,
	open,
	onOpenChange,
	children,
}: IrreversableConfirmationDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle className="text-destructive">{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
					<div className="text-destructive">{message}</div>
				</DialogHeader>
				<div className="flex justify-end gap-4">
					<DialogClose asChild>
						<Button variant={"secondary"} type="button">
							Cancel
						</Button>
					</DialogClose>
					{children}
				</div>
			</DialogContent>
		</Dialog>
	);
}
