import { getSettings } from "@app/(website)/serverActionsGlobal";
import { columns } from "./components/Columns";
import ReservationPage from "./components/ReservationPage";
import dummyReservations from "./dummyData";
import { convertDateToString } from "@lib/utils";

export default async function ReservationsPage() {
	const mod = dummyReservations.map(dummy => ({
		...dummy,
		eventTime: convertDateToString(new Date(dummy.eventTime)),
	}));
	const settings = await getSettings();
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
				{/* <AdminCalendar  /> */}
				<ReservationPage
					data={mod}
					columns={columns}
					maintainanceDates={settings?.maintainanceDates}
				/>
			</div>
		</div>
	);
}
