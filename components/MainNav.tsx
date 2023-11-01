"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@lib/utils";

type MainNavProps = {
	navBtns: {
		name: string;
		href: string;
	}[];
} & React.ComponentProps<"div">;
export function MainNav({ className, navBtns, ...props }: MainNavProps) {
	let currentPage = usePathname();
	return (
		<div
			className={cn("flex items-center space-x-4 lg:space-x-6", className)}
			{...props}>
			{navBtns.map(value => {
				let selected = currentPage.startsWith(value.href) && value.href !== "/";
				return (
					<Link
						href={value.href}
						key={value.name}
						className={cn(
							"text-sm font-medium transition-colors hover:text-primary",
							selected && "text-primary"
						)}
						replace>
						{value.name}
					</Link>
				);
			})}
		</div>
	);
}
