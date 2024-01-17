import { getMaintainanceDates } from "@app/(website)/serverActionsGlobal";
import VenuePage from "./components/VenuePage";

export default async function page() {
	const maintainance = await getMaintainanceDates();
	return (
		<div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Venue</h2>
					<p className="text-muted-foreground">Manage venues</p>
				</div>
			</div>
			<div className="flex gap-4">
				<VenuePage maintainanceDates={maintainance.map(d => d.date)} />
			</div>
		</div>
	);
}
