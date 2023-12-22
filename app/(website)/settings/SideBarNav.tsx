"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@lib/utils";
import { buttonVariants } from "@components/ui/button";
import { Separator } from "@components/ui/separator";

enum AccessLevel {
	GUEST = 0,
	USER = 1,
	ADMIN = 2,
}
type SidebarNavProps = {
	role?: "USER" | "ADMIN";
};
export function SidebarNav({ role }: SidebarNavProps) {
	const pathname = usePathname();
	const separator = "Separator";
	const accessLevel = role
		? role === "ADMIN"
			? AccessLevel.ADMIN
			: AccessLevel.USER
		: AccessLevel.GUEST;
	const items = [
		{
			title: "General",
			href: "/settings/general",
			accessLevel: AccessLevel.ADMIN,
		},
		{
			title: "Account",
			href: "/settings/account",
			accessLevel: AccessLevel.USER,
		},
		{
			title: "Account",
			href: "/settings/account",
			accessLevel: AccessLevel.ADMIN,
		},
		{
			title: "Reservations",
			href: "/settings/reservations",
			accessLevel: AccessLevel.USER,
		},
		{
			title: separator,
			href: "Sp1",
			accessLevel: AccessLevel.ADMIN,
		},
		{
			title: "Backup & Restore",
			href: "/settings/snapshot",
			accessLevel: AccessLevel.ADMIN,
		},
		// {
		// 	title: "Create admin account",
		// 	href: "/settings/createAccount",
		// 	accessLevel: AccessLevel.ADMIN,
		// },
	];
	return (
		<nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
			{items.map(item => {
				if (separator === item.title) {
					return <Separator key={item.href + item.title} />;
				}
				return (
					accessLevel === item.accessLevel && (
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
					)
				);
			})}
		</nav>
	);
}
