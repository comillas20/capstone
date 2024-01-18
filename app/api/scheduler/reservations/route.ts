import prisma from "@lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	const reservations = await prisma.reservations.updateMany({
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

	if (reservations) return new Response("ok", { status: 200 });
	else return new Response("not ok", { status: 500 });
}
