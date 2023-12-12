import "@styles/globals.css";
import type { Metadata } from "next";
import { twJoin } from "tailwind-merge";
import { Inter } from "next/font/google";
import { Toaster } from "@components/ui/toaster";
import { ThemeProvider } from "@components/ThemeProvider";
import Brand from "@components/Brand";
import { MainNav } from "@components/MainNav";
import { ThemeModeSwitcher } from "@components/ThemeModeSwitcher";
import UserNav from "@components/UserNav";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Jakelou | Online Revervation and Catering",
	description:
		"Discover an effortless way to manage your catering needs and reservations online. Our system streamlines the entire process, allowing you to browse menus, select dishes, and make hassle-free reservations. Experience convenience and reliability with our user-friendly platform for all your catering and event planning requirements.",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(options);
	const mainNav = session && session.user.role === "ADMIN" ? adminNav : userNav;
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={twJoin(inter.className, "max-h-screen")}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange>
					<div className="flex flex-col md:flex">
						<nav className="border-b">
							<div className="flex h-16 items-center px-4">
								<Brand />
								<MainNav className="mx-6" navBtns={mainNav} />
								<div className="ml-auto flex items-center space-x-4">
									{/* <Search /> */}
									<ThemeModeSwitcher />
									<UserNav />
								</div>
							</div>
						</nav>
						{children}
					</div>
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
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
		name: "Reservations",
		href: "/reservations",
	},
	{
		// includes product viewing
		name: "Products",
		href: "/products",
	},
	{
		name: "Venue",
		href: "/venue",
	},
];
