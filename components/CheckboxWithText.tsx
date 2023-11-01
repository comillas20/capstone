"use client";

import { Checkbox } from "@components/ui/checkbox";
import { cn } from "@lib/utils";
type CheckboxWithTextProps = {
	children: string;
	className?: string;
} & React.ComponentProps<typeof Checkbox>;
export function CheckboxWithText({
	children,
	className,
	...props
}: CheckboxWithTextProps) {
	return (
		<label
			className={cn(
				"flex items-center gap-4 space-x-2 text-sm font-medium leading-none",
				props.disabled &&
					"group-disabled/check:cursor-not-allowed group-disabled:opacity-70",
				className
			)}>
			<Checkbox className="group/check" {...props} />
			{children}
		</label>
	);
}
