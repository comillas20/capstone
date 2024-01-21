import { getServerSession } from "next-auth";
import ReservationForm from "./components/ReservationForm";
import { options } from "@app/api/auth/[...nextauth]/options";
import { Settings } from "@app/(website)/settings/general/page";
import {
	getAllVenues,
	getMaintainanceDates,
	getSystemSettings,
} from "@app/(website)/serverActionsGlobal";
// import ReservationList from "./components/ReservationList";
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
	};
}
export default async function page() {
	const session = await getServerSession(options);
	const settings = await convertToObject();
	const venues = await getAllVenues();
	return (
		<div className="flex w-full flex-col space-y-32">
			<div className="flex-col space-y-4">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Offers</h2>
					<p className="text-muted-foreground">Pick the best offers for you!</p>
				</div>
				{settings && venues.length > 0 && (
					<ReservationForm session={session} settings={settings} venues={venues} />
				)}
			</div>
			{/* {session && session.user.id && (
				<div className="flex-col space-y-4">
					<div className="space-y-0.5">
						<h2 className="text-2xl font-bold tracking-tight">
							Your Reservation List
						</h2>
						<p className="text-muted-foreground">See your history with us!</p>
					</div>
					<ReservationList session={session} />
				</div>
			)} */}
		</div>
	);
}
