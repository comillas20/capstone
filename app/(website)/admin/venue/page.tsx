import { getMaintainanceDates } from "@app/(website)/serverActionsGlobal";
import ReservationPage from "./components/ReservationPage";
import { Button } from "@components/ui/button";

export default async function ReservationsPage() {
	const maintainance = await getMaintainanceDates();
	return (
		<div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
					<p className="text-muted-foreground">
						Here&apos;s the current list of reservations!
					</p>
				</div>
			</div>
			<div className="flex gap-4">
				<ReservationPage maintainanceDates={maintainance.map(d => d.date)} />
				
			</div>
			
		</div>
	);
}
