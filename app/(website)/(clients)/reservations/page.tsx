import { getServerSession } from "next-auth";
import ReservationForm from "./components/ReservationForm";
import { options } from "@app/api/auth/[...nextauth]/options";
import prisma from "@lib/db";

export default async function page() {
	const session = await getServerSession(options);
	return (
		<div className="flex w-full flex-col space-y-6">
			<div className="space-y-0.5">
				<h2 className="text-2xl font-bold tracking-tight">Offers</h2>
				<p className="text-muted-foreground">Pick the best offers for you!</p>
			</div>

			<ReservationForm session={session} />
		</div>
	);
}
