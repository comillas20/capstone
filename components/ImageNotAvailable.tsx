import { cn } from "@lib/utils";
import { AspectRatio } from "./ui/aspect-ratio";

export default function ImageNotAvailable({
	className,
	children,
	...props
}: {
	className?: string;
	children?: React.ReactNode;
} & React.ComponentProps<typeof AspectRatio>) {
	return (
		<AspectRatio
			className={cn("flex h-full w-full bg-secondary", className)}
			{...props}>
			{children ? children : <div className="m-auto">No image</div>}
		</AspectRatio>
	);
}
