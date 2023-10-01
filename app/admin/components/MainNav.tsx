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
			href: "/admin/overview",
		},
		{
			// includes pending and accepted reservations, setting unavailable dates
			name: "Reservations",
			href: "/admin/reservations",
		},
		{
			// includes refunds, register verification, and payments
			name: "Customers",
			href: "/admin/customers",
		},
		{
			// includes product creation, modification, deletion
			name: "Products",
			href: "/admin/products",
		},
		{
			name: "Settings",
			href: "/admin/settings/account",
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
						key={value.name}
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
