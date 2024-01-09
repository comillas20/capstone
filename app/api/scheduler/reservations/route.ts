import prisma from "@lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
	const reservations = await prisma.reservations.updateMany({
		where: {
			eventDate: {
				lt: new Date(),
			},
			status: "PENDING",
		},
		data: {
			status: "IGNORED",
		},
	});

	return new Response("ok", { status: 200 });
}
