import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

// Helper function to get raw body
// async function getRawBody(readable: Readable): Promise<Buffer> {
// 	const chunks = [];
// 	for await (const chunk of readable) {
// 		chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
// 	}
// 	return Buffer.concat(chunks);
// }

export async function POST(req: NextRequest, res: NextResponse) {
	console.log("Yes, this was called");
	// This is where you handle the incoming webhook event
	// const rawBody = await getRawBody(req);
	const rawBody = await req.json(); //this is where I get the event like when user successfully pays
	//const event = req.body;
	//console.log("event", event);
	console.log("Raw body for this request is:", rawBody);

	// Parse the raw body into JSON
	const data = JSON.parse(rawBody.toString("utf8"));
	console.log("JSON data for this request is:", data);

	// const ownSig =

	// PayMongo adds a `Paymongo-Signature` HTTP header to the data that they send to your webhook
	// This header can be used to verify that the request came from PayMongo
	// const signature = req.headers["paymongo-signature"];

	// TODO: Verify the signature

	// Always respond with a 200 or 2xx after receiving the webhook event
	// res.status(200).json({ received: true });
	return new Response("", { status: 200 });
}
