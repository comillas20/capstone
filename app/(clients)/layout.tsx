import BranchSwitcher from "@components/BranchSwitcher";
import { MainNav } from "@components/MainNav";
import UserNav from "@components/UserNav";
import Brand from "./components/Brand";

export default function Layout({ children }: { children: React.ReactNode }) {
	const navBtns = [
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
			name: "Settings",
			href: "/settings",
		},
		{
			name: "About Us",
			href: "/about",
		},
	];
	return (
		<div className="flex flex-col md:flex">
			<nav className="border-b">
				<div className="flex h-16 items-center px-4">
					<Brand />
					<MainNav className="mx-6" navBtns={navBtns} />
					<div className="ml-auto flex items-center space-x-4">
						{/* <Search /> */}
						<UserNav />
					</div>
				</div>
			</nav>
			<main className="flex-1 space-y-4 px-16 py-4">{children}</main>
		</div>
	);
}
