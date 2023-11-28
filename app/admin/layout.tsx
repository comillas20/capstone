import { MainNav } from "@components/MainNav";
import UserNav from "@components/UserNav";

export async function generateMetadata() {
	return {
		title: "Jakelou - Admin",
		description: "Admin dashboard for management",
	};
}

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
			href: "/admin/settings",
		},
	];
	return (
		<div className="flex flex-col md:flex">
			<nav className="border-b">
				<div className="flex h-16 items-center px-4">
					<MainNav className="mx-6" navBtns={navBtns} />
					<div className="ml-auto flex items-center space-x-4">
						{/* <Search /> */}
						<UserNav />
					</div>
				</div>
			</nav>
			<main className="flex-1 space-y-4 px-8 py-4">{children}</main>
		</div>
	);
}
