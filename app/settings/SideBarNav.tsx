"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@lib/utils";
import { buttonVariants } from "@components/ui/button";
import { Separator } from "@components/ui/separator";

export function SidebarNav() {
	const pathname = usePathname();
	const separator = "Separator";
	const items = [
		{ title: "General", href: "/settings/general" },
		{
			title: "Account",
			href: "/settings/account",
		},
		{
			title: "Separator",
			href: "Sp1",
		},
		{
			title: "Backup & Restore",
			href: "/settings/snapshot",
		},
		{
			title: "Create admin account",
			href: "/settings/createAccount",
		},
	];
	return (
		<nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
			{items.map(item => {
				if (separator === item.title) {
					return <Separator key={item.href + item.title} />;
				}
				return (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							buttonVariants({ variant: "ghost" }),
							pathname === item.href
								? "bg-muted hover:bg-muted"
								: "hover:bg-transparent hover:underline",
							"justify-start"
						)}
						replace>
						{item.title}
					</Link>
				);
			})}
		</nav>
	);
}
