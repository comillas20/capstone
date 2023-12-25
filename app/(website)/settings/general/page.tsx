import { Separator } from "@components/ui/separator";
import { GeneralForm } from "./GeneralForm";
import prisma from "@lib/db";
import { getSettings } from "@app/(website)/serverActionsGlobal";
import {
	ClosingHour,
	MaintainanceDates,
	MinimumPerHead,
	OpeningHour,
	ReservationCostPerHour,
	ReservationHours,
} from "./Menu";

export default async function GeneralPage() {
	const settings = await getSettings();
	const s2 = settings
		? {
				...settings,
				maintainanceDates: settings.maintainanceDates.map(m => m.date),
		  }
		: null;
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">General</h3>
				<p className="text-sm text-muted-foreground">General setings</p>
			</div>
			<Separator />
			<GeneralForm settings={s2} />
			{/* <div className="space-y-4 pl-4">
				<div className="flex items-center justify-between">
					<h4>Service Hours</h4>
					<div className="flex flex-row gap-1.5">
						<OpeningHour openingTime={s2?.openingTime} />
						<span>to</span>
						<ClosingHour closingTime={s2?.closingTime} />
					</div>
				</div>
				<div className="flex items-center justify-between">
					<h4>Maintainance Dates</h4>
					<MaintainanceDates maintainanceDates={s2?.maintainanceDates} />
				</div>
				<div className="flex items-center justify-between">
					<h4>Minimum Guests</h4>
					<MinimumPerHead minHead={s2?.defaultMinimumPerHead} />
				</div>
				<div className="flex items-center justify-between">
					<h4>Reservation Hours</h4>
					<ReservationHours
						min={s2?.minimumCustomerReservationHours}
						max={s2?.maximumCustomerReservationHours}
					/>
				</div>
				<div className="flex items-center justify-between">
					<h4>Reservation Cost/Hour</h4>
					<ReservationCostPerHour c={s2?.reservationCostPerHour} />
				</div>
			</div> */}
		</div>
	);
}
