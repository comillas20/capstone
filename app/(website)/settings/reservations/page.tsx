import { Separator } from "@components/ui/separator";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import prisma from "@lib/db";
import ReservationList from "./components/ReservationList";
import { columns } from "./components/Columns";

export default async function SettingsAccountPage() {
	const session = await getServerSession(options);
	// session details is static(?), until user log outs
	const data = session
		? await prisma.account.findUnique({
				where: {
					id: session.user.id,
				},
		  })
		: undefined;
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Reservations</h3>
				<p className="text-sm text-muted-foreground">View recent reservations</p>
			</div>
			<Separator />
			<ReservationList data={[]} columns={columns} />
		</div>
	);
}
