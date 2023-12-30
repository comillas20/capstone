import { PencilIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@lib/utils";
import { forwardRef } from "react";

type EditableButtonTextProps = {
	text?: string;
	iconClassName?: string;
	iconSize?: number;
} & React.ComponentProps<typeof Button>;
const EditableButtonText = forwardRef<
	HTMLButtonElement,
	EditableButtonTextProps
>(({ text, iconClassName, className, iconSize, ...props }, ref) => {
	return (
		<Button
			ref={ref}
			className={cn(
				"flex items-center justify-center gap-2 text-inherit",
				className
			)}
			{...props}>
			<span>{text ? text : ""}</span>
			<PencilIcon className={iconClassName} size={iconSize} />
		</Button>
	);
});
EditableButtonText.displayName = "EditableButtonText";
export default EditableButtonText;
