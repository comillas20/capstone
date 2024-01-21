import prisma from "@lib/db";

export async function GET() {
	const reservations = await prisma.reservations.updateMany({
		where: {
			eventDate: {
				lt: new Date(),
			},
			OR: [
				{
					status: "PENDING",
				},
				{ status: "PARTIAL" },
			],
		},
		data: {
			status: "CANCELLED",
		},
	});

	const reservations2 = await prisma.reservations.updateMany({
		where: {
			eventDate: {
				lt: new Date(),
			},
			status: "ONGOING",
		},
		data: {
			status: "COMPLETED",
		},
	});

	if (reservations && reservations2) return new Response("ok", { status: 200 });
	else return new Response("not ok", { status: 500 });
}
