import { getServerSession } from "next-auth";
import ReservationForm from "./components/ReservationForm";
import { options } from "@app/api/auth/[...nextauth]/options";
import { Settings } from "@app/(website)/settings/general/page";
import {
	getMaintainanceDates,
	getSystemSettings,
} from "@app/(website)/serverActionsGlobal";
export function generateMetadata() {
	return {
		title: "Reservation | Jakelou",
	};
}
type SettingsObject = {
	openingTime: Date;
	closingTime: Date;
	minReservationHours: number;
	maxReservationHours: number;
	minPerHead: number;
	reservationCostPerHour: number;
};
async function convertToObject(): Promise<SettingsObject> {
	const settings = await getSystemSettings();
	const openingTime = settings.find(s => s.name === Settings.openingHour);
	const closingTime = settings.find(s => s.name === Settings.closingHour);
	const minReservationHours = settings.find(
		s => s.name === Settings.minReservationHours
	);
	const maxReservationHours = settings.find(
		s => s.name === Settings.maxReservationHours
	);
	const minPerHead = settings.find(s => s.name === Settings.minPerHead);
	const reservationCostPerHour = settings.find(
		s => s.name === Settings.reservationCostPerHour
	);
	return {
		openingTime: openingTime
			? (openingTime.value as Date)
			: new Date("January 20, 2002 00:00:00"),
		closingTime: closingTime
			? (closingTime.value as Date)
			: new Date("January 20, 2002 00:00:00"),
		minReservationHours: minReservationHours
			? (minReservationHours.value as number)
			: 4,
		maxReservationHours: maxReservationHours
			? (maxReservationHours.value as number)
			: 10,
		minPerHead: minPerHead ? (minPerHead.value as number) : 50,
		reservationCostPerHour: reservationCostPerHour
			? (reservationCostPerHour.value as number)
			: 500,
	};
}
export default async function page() {
	const session = await getServerSession(options);
	const settings = await convertToObject();
	const maintainance = await getMaintainanceDates();
	return (
		<div className="flex w-full flex-col space-y-4">
			<div className="space-y-0.5">
				<h2 className="text-2xl font-bold tracking-tight">Offers</h2>
				<p className="text-muted-foreground">Pick the best offers for you!</p>
			</div>
			{settings && maintainance && (
				<ReservationForm
					session={session}
					settings={settings}
					maintainanceDates={maintainance.map(d => d.date)}
				/>
			)}
		</div>
	);
}
