import { Separator } from "@components/ui/separator";
import { getMaintainanceDates } from "@app/(website)/serverActionsGlobal";
import {
	OpeningHour,
	ClosingHour,
	MaintainanceDates,
	MinimumPerHead,
	ReservationHours,
	ReservationCostPerHour,
	FAQ,
} from "./Settings";

export default async function GeneralPage() {
	const maintainanceDates = await getMaintainanceDates();
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">General</h3>
				<p className="text-sm text-muted-foreground">General setings</p>
			</div>
			<Separator />
			<div className="space-y-4 pl-4">
				<div className="flex items-center justify-between">
					<h4>Service Hours</h4>
					<div className="flex flex-row gap-1.5">
						<OpeningHour />
						<span>to</span>
						<ClosingHour />
					</div>
				</div>
				<div className="flex items-center justify-between">
					<h4>Maintainance Dates</h4>
					<MaintainanceDates
						maintainanceDates={maintainanceDates.map(d => d.date)}
					/>
				</div>
				<div className="flex items-center justify-between">
					<h4>Minimum Guests</h4>
					<MinimumPerHead />
				</div>
				<div className="flex items-center justify-between">
					<h4>Reservation Hours</h4>
					<ReservationHours />
				</div>
				<div className="flex items-center justify-between">
					<h4>Reservation Cost/Hour</h4>
					<ReservationCostPerHour />
				</div>
				<FAQ />
			</div>
		</div>
	);
}

/**
 * the key will be used in the system,
 * the value is what is stored in the db (at SystemSettings table) as the name
 */
export enum Settings {
	openingHour = "openingHour",
	closingHour = "closingHour",
	minPerHead = "minimumPerHead",
	minReservationHours = "minReservationHours",
	maxReservationHours = "maxReservationHours",
	reservationCostPerHour = "reservationCostPerHour",
}
