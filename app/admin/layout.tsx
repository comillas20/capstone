import { MainNav } from "@app/admin/components/MainNav";
import { Search } from "@components/Search";
import BranchSwitcher from "@app/admin/components/BranchSwitcher";
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
	return (
		<div className="flex flex-col md:flex">
			<nav className="border-b">
				<div className="flex h-16 items-center px-4">
					<BranchSwitcher />
					<MainNav className="mx-6" />
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
