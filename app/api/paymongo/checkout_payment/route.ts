import prisma from "@lib/db";
import { NextRequest, NextResponse } from "next/server";

type RequestType = {
	data: {
		attributes: {
			type: "checkout_session.payment.paid";
			data: {
				attributes: {
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
								venue: string;
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
		const request: RequestType = await req.json(); //this is where I get the event, like when user successfully pays
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
						eventDate: new Date(
							request.data.attributes.data.attributes.payments[0].attributes.metadata.eventDate
						),

						eventDuration: parseInt(
							request.data.attributes.data.attributes.payments[0].attributes.metadata
								.eventDuration
						),
						eventType:
							request.data.attributes.data.attributes.payments[0].attributes.metadata
								.eventType,
						setName: request.data.attributes.data.attributes.line_items[0].name,

						dishes: JSON.parse(
							request.data.attributes.data.attributes.payments[0].attributes.metadata
								.dishes
						),
						userID: parseInt(
							request.data.attributes.data.attributes.payments[0].attributes.metadata
								.userID
						),
						totalPaid: parseFloat(
							request.data.attributes.data.attributes.payments[0].attributes.metadata
								.totalPaid
						),
						totalCost: parseFloat(
							request.data.attributes.data.attributes.payments[0].attributes.metadata
								.totalCost
						),
						venue:
							request.data.attributes.data.attributes.payments[0].attributes.metadata
								.venue,
					},
				},
			},
		});
		return new Response("ok", { status: 200 });
	} catch (error) {
		return new Response("not ok", { status: 200 });
	}
}
