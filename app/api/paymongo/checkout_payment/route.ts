import { sendSMS } from "@app/(website)/serverActionsGlobal";
import prisma from "@lib/db";
import { NextRequest, NextResponse } from "next/server";

type RequestType = {
	data: {
		attributes: {
			type: "checkout_session.payment.paid";
			data: {
				attributes: {
					billing: {
						email: string | null;
						name: string | null;
						phone: string | null;
					};
					line_items: {
						amount: number;
						currency: "PHP";
						name: string;
						quantity: number;
					}[];
					payments: {
						id: string;
						type: "payment";
						attributes: {
							amount: number;
							balance_transaction_id: string;
							currency: "PHP";
							external_reference_number: number | null;
							fee: number;
							net_amount: number;
							payment_intent_id: string;
							status: "paid";
							tax_amount: number;
							metadata: {
								message: string;
								eventDate: string;
								eventDuration: string;
								eventType: string;
								userID: string;
								dishes: string;
								totalPaid: string;
								totalCost: string;
								venueID: string;
								phoneNumber: string;
							};
						};
					}[];
					reference_number: string;
					status: "active";
				};
			};
		};
	};
};
export async function POST(req: NextRequest, res: NextResponse) {
	try {
		console.log("starting to save a checkout");
		const request: RequestType = await req.json(); //this is where I get the event, like when user successfully pays
		const eventDate = new Date(
			request.data.attributes.data.attributes.payments[0].attributes.metadata.eventDate
		);
		const eventDuration = parseInt(
			request.data.attributes.data.attributes.payments[0].attributes.metadata
				.eventDuration
		);
		const eventType =
			request.data.attributes.data.attributes.payments[0].attributes.metadata
				.eventType;
		const setName = request.data.attributes.data.attributes.line_items[0].name;
		const dishes = JSON.parse(
			request.data.attributes.data.attributes.payments[0].attributes.metadata
				.dishes
		) as string[];
		const userID = parseInt(
			request.data.attributes.data.attributes.payments[0].attributes.metadata
				.userID
		);
		const totalPaid = parseFloat(
			request.data.attributes.data.attributes.payments[0].attributes.metadata
				.totalPaid
		);
		const totalCost = parseFloat(
			request.data.attributes.data.attributes.payments[0].attributes.metadata
				.totalCost
		);
		const venueID = parseFloat(
			request.data.attributes.data.attributes.payments[0].attributes.metadata
				.venueID
		);
		const reservation = await prisma.transactions.create({
			data: {
				fee:
					request.data.attributes.data.attributes.payments[0].attributes.fee / 100,
				netAmount:
					request.data.attributes.data.attributes.payments[0].attributes.net_amount /
					100,
				paymentID: request.data.attributes.data.attributes.payments[0].id,
				message:
					request.data.attributes.data.attributes.payments[0].attributes.metadata
						.message,
				reservation: {
					create: {
						eventDate: eventDate,
						eventDuration: eventDuration,
						eventType: eventType,
						setName: setName,
						dishes: dishes,
						userID: userID,
						totalPaid: totalPaid,
						totalCost: totalCost,
						venueID: venueID,
					},
				},
			},
		});

		console.log("saved a checkout");

		const venue = await prisma.venues.findUnique({
			where: {
				id: venueID,
			},
			select: {
				location: true,
			},
		});
		// send sms
		const message = `Your reservation in Jakelou has been successfully reserved.\n\n
		Your reservation details:\n
		Reference no.: ${request.data.attributes.data.attributes.reference_number}\n
		Event Date: ${eventDate}\n
		${venue ? "Where: " + venue.location : ""}\n
		How long: ${eventDuration} hours\n
		What kind of event: ${eventType}\n
		Amount paid: ${totalPaid}\n
		Total cost: ${totalCost}\n\n
		${
			totalCost > totalPaid
				? "Please pay in full before 3 days prior to the event date, failure to do so may result your reservation being cancelled."
				: ""
		}`;

		const phoneNumber = request.data.attributes.data.attributes.billing.phone;
		if (phoneNumber) {
			const result = await sendSMS({
				message: message,
				recipient: phoneNumber,
			});
			console.log("SMS", result);
		} else console.log("NO PHONE NUMBER!!!");
		return new Response("ok", { status: 200 });
	} catch (error) {
		console.log("Error", error);
		return new Response("not ok", { status: 200 });
	}
}
