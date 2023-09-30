"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@lib/utils";

export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const navBtns = [
		{
			// includes reports and other statistics
			name: "Overview",
			href: "/admin/dashboard",
		},
		{
			// includes refunds, register verification, and payments
			name: "Customers",
			href: "/admin/customers",
		},
		{
			name: "Products",
			href: "/admin/products",
		},
		{
			name: "Settings",
			href: "/admin/settings",
		},
	];
	let currentPage = usePathname();
	return (
		<div
			className={cn("flex items-center space-x-4 lg:space-x-6", className)}
			{...props}>
			{navBtns.map(value => {
				let selected = currentPage.startsWith(value.href);
				return (
					<Link
						href={value.href}
						className={cn(
							"text-sm font-medium transition-colors hover:text-primary",
							!selected && "text-muted-foreground"
						)}>
						{value.name}
					</Link>
				);
			})}
		</div>
	);
}
