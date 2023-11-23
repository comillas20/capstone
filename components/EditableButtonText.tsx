import { PencilIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@lib/utils";

export default function EditableButtonText({
	text,
	iconClassName,
	className,
	iconSize,
	...props
}: {
	text?: string;
	iconClassName?: string;
	iconSize?: number;
} & React.ComponentProps<typeof Button>) {
	return (
		<Button
			className={cn(
				"flex items-center justify-center gap-2 text-inherit",
				className
			)}
			{...props}>
			<span>{text ? text : ""}</span>
			<PencilIcon className={iconClassName} size={iconSize} />
		</Button>
	);
}
