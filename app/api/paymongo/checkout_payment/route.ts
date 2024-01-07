import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
	console.log("Yes, this was called");
	const rawBody = await req.json(); //this is where I get the event like when user successfully pays
	console.log("Raw body for this request is:", rawBody);
	return new Response("ok", { status: 200 });
}

async function createReservation() {}
