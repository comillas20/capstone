import { Separator } from "@components/ui/separator";
import { SidebarNav } from "./SideBarNav";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
export function generateMetadata() {
	return {
		title: "Settings | Jakelou",
	};
}
export default async function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(options);
	return (
		<main className="flex-1 space-y-4 px-8 py-4">
			<div className="space-y-6">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
					<p className="text-muted-foreground">
						Manage your account settings and other things.
					</p>
				</div>
				<Separator className="my-6" />
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className="lg:-mx-4 lg:w-1/5">
						<SidebarNav role={session?.user.role} />
					</aside>
					<div className="max-w-2xl flex-1">{children}</div>
				</div>
			</div>
		</main>
	);
}
