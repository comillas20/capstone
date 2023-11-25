import { cn } from "@lib/utils";

export default function ImageNotAvailable({
	className,
	children,
	...props
}: {
	className?: string;
	children?: React.ReactNode;
} & React.ComponentProps<"div">) {
	return (
		<div className={cn("flex h-full w-full bg-secondary", className)} {...props}>
			{children ? children : <div className="m-auto">No image</div>}
		</div>
	);
}
