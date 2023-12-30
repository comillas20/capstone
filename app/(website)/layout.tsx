import Brand from "@app/(website)/Brand";
import { MainNav } from "@app/(website)/MainNav";
import { ThemeModeSwitcher } from "@app/(website)/ThemeModeSwitcher";
import UserNav from "@app/(website)/UserNav";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

export default async function WebsiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(options);
	const mainNav = session && session.user.role === "ADMIN" ? adminNav : userNav;
	return (
		<div className="flex flex-col md:flex">
			<nav className="border-b">
				<div className="flex h-16 items-center px-4">
					<Brand />
					<MainNav className="mx-6" navBtns={mainNav} />
					<div className="ml-auto flex items-center space-x-4">
						<ThemeModeSwitcher />
						<UserNav session={session} />
					</div>
				</div>
			</nav>
			{children}
		</div>
	);
}

const adminNav = [
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
];

const userNav = [
	{
		// includes available slots, calendar, ToC
		name: "Reserve",
		href: "/reservations",
	},
	{
		// includes product viewing
		name: "View Products",
		href: "/products",
	},
	// {
	// 	name: "Venue",
	// 	href: "/venue",
	// },
];
