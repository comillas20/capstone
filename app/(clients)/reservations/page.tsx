import Offers from "./components/Offers";
import ReservationCalendar from "./components/ReservationCalendar";
export default function page() {
	return (
		<div className="flex w-full flex-col space-y-6">
			<div className="space-y-0.5">
				<h2 className="text-2xl font-bold tracking-tight">Offers</h2>
				<p className="text-muted-foreground">Pick the best offers for you!</p>
			</div>
			<Offers />
			<ReservationCalendar />
		</div>
	);
}
