"use server";
import prisma from "@lib/db";

type Reservation = {
	eventDate: Date;
	userID: number;
	userName: string;
	phoneNumber: string | null;
	email: string | null;
	totalPrice: number;
	eventDuration: number;
	orders: {
		id: number;
		name: string;
	}[];
};
export async function getCurrentUser(currentID: number) {
	return await prisma.account.findUnique({
		where: {
			id: currentID,
		},
		select: {
			id: true,
			name: true,
			phoneNumber: true,
		},
	});
}
// export async function createReservation(reserve: Reservation) {
// 	try {
// 		const data = {
// 			data: {
// 				attributes: {
// 					amount: reserve.totalPrice * 100,
// 					payment_method_allowed: ["gcash"],
// 					payment_method_options: {
// 						card: {
// 							request_three_d_secure: "any",
// 						},
// 					},
// 					currency: "PHP",
// 					description: "Payment for the reservation",
// 					statement_descriptor: "Jakelou",
// 				},
// 			},
// 		};
// 		const optionsIntent = {
// 			method: "POST",
// 			headers: {
// 				Accept: "application/json",
// 				"Content-Type": "application/json",
// 				Authorization: `Basic ${Buffer.from(
// 					process.env.PAYMONGO_SECRET as string
// 				).toString("base64")}`, // HTTP Basic Auth and Encoding
// 			},
// 			body: JSON.stringify(data),
// 			// The req.body should follow this specific format
// 			//   {
// 			//     "data": {
// 			//          "attributes": {
// 			//               "amount": 10000 (int32) note that 10000 = PHP 100.00,
// 			//               "payment_method_allowed": [
// 			//                    "card",
// 			//                    "paymaya"
// 			//               ](string array),
// 			//               "payment_method_options": {
// 			//                    "card": {
// 			//                         "request_three_d_secure": "any"
// 			//                    }
// 			//               },
// 			//               "currency": "PHP" (string),
// 			//               "description": "description" (string),
// 			//               "statement_descriptor": "descriptor business name" (string)
// 			//          }
// 			//     }
// 			//  }
// 		};

// 		const response = await fetch(
// 			"https://api.paymongo.com/v1/payment_intents",
// 			optionsIntent
// 		);

// 		const result = await response.json();
// 		console.log("result", result);

// 		const createdReservation = await prisma.reservations.create({
// 			data: {
// 				eventDate: reserve.eventDate,
// 				eventDuration: reserve.eventDuration,
// 				totalPrice: reserve.totalPrice,
// 				orders: {
// 					connect: reserve.orders.map(order => ({
// 						id: order.id,
// 					})),
// 				},
// 				reservedAt: new Date(),
// 				userID: reserve.userID,
// 			},
// 			include: {
// 				user: {
// 					select: {
// 						name: true,
// 						phoneNumber: true,
// 					},
// 				},
// 			},
// 		});

// 		return createdReservation.id;
// 	} catch (error) {
// 		console.error("Error:", error);
// 	}

// 	return null;
// }

export async function getALlDishesWithCourses() {
	return await prisma.dish.findMany({
		select: {
			id: true,
			name: true,
			category: {
				select: {
					course: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});
}

// const publicKey = process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC as string;
// const createSource = async () => {
// 	const options = {
// 		method: "POST",
// 		headers: {
// 			Accept: "application/json",
// 			"Content-Type": "application/json",
// 			Authorization: `Basic ${Buffer.from(publicKey).toString("base64")}`,
// 		},
// 		body: JSON.stringify({
// 			data: {
// 				attributes: {
// 					amount: 100 * 100,
// 					redirect: {
// 						success: "http://localhost:3000/payment",
// 						failed: "http://localhost:3000/payment",
// 					},
// 					billing: { name: `Jin`, phone: `0912345789`, email: `jin@gmail.com` },
// 					type: "gcash", //change to graby_pay in GrabPay.js
// 					currency: "PHP",
// 				},
// 			},
// 		}),
// 	};
// 	return fetch("https://api.paymongo.com/v1/sources", options)
// 		.then(response => response.json())
// 		.then(response => {
// 			return response;
// 		})
// 		.catch(err => console.error(err));
// };

// const listenToPayment = async (sourceId: string) => {
// 	let i = 5;
// 	for (let i = 5; i > 0; i--) {
// 		await new Promise(resolve => setTimeout(resolve, 1000));

// 		if (i == 1) {
// 			const sourceData = await fetch(
// 				"https://api.paymongo.com/v1/sources/" + sourceId,
// 				{
// 					headers: {
// 						// Base64 encoded public PayMongo API key.
// 						Authorization: `Basic ${Buffer.from(publicKey).toString("base64")}`,
// 					},
// 				}
// 			)
// 				.then(response => {
// 					return response.json();
// 				})
// 				.then(response => {
// 					console.log(response.data);
// 					return response.data;
// 				});

// 			if (sourceData.attributes.status === "failed") {
// 				// setPaymentStatus("Payment Failed");
// 			} else if (sourceData.attributes.status === "paid") {
// 				// setPaymentStatus("Payment Success");
// 			} else {
// 				i = 5;
// 				// setPayProcess(sourceData.attributes.status);
// 			}
// 		}
// 	}
// };

// async function createCheckOutSession() {
// 	const options = {
// 		method: "POST",
// 		headers: {
// 			accept: "application/json",
// 			"Content-Type": "application/json",
// 			authorization: `Basic ${Buffer.from(publicKey).toString("base64")}`,
// 		},
// 		body: JSON.stringify({
// 			data: {
// 				attributes: {
// 					send_email_receipt: false,
// 					show_description: true,
// 					show_line_items: true,
// 					line_items: [{ currency: "PHP", amount: 10000, name: "Jin", quantity: 1 }],
// 					payment_method_types: ["gcash"],
// 					description: "Reservation",
// 				},
// 			},
// 		}),
// 	};

// 	const response = await fetch(
// 		"https://api.paymongo.com/v1/checkout_sessions",
// 		options
// 	);
// 	// im supposed to store checkout session id in db
// 	// sample output
// 	// 	{
// 	//   "data": {
// 	//     "id": "cs_kQ9wvLExcz36UJ8DMeJ4Aqg5",
// 	//     "type": "checkout_session",
// 	//     "attributes": {
// 	//       "billing": {
// 	//         "address": {
// 	//           "city": null,
// 	//           "country": null,
// 	//           "line1": null,
// 	//           "line2": null,
// 	//           "postal_code": null,
// 	//           "state": null
// 	//         },
// 	//         "email": null,
// 	//         "name": null,
// 	//         "phone": null
// 	//       },
// 	//       "billing_information_fields_editable": "enabled",
// 	//       "cancel_url": null,
// 	//       "checkout_url": "https://checkout.paymongo.com/cs_kQ9wvLExcz36UJ8DMeJ4Aqg5_client_VKqLf7Zn7Dmzp7NYfSwQQvMa#cGtfdGVzdF9maGFHc0thaUFFc3MzeDRlQnF6QUNhbWI=",
// 	//       "client_key": "cs_kQ9wvLExcz36UJ8DMeJ4Aqg5_client_VKqLf7Zn7Dmzp7NYfSwQQvMa",
// 	//       "customer_email": null,
// 	//       "description": "Reservation",
// 	//       "line_items": [
// 	//         {
// 	//           "amount": 10000,
// 	//           "currency": "PHP",
// 	//           "description": null,
// 	//           "images": [],
// 	//           "name": "Jin",
// 	//           "quantity": 1
// 	//         }
// 	//       ],
// 	//       "livemode": false,
// 	//       "merchant": "Jakelou",
// 	//       "payments": [],
// 	//       "payment_intent": {
// 	//         "id": "pi_yKL8nm3RGyqUJVBMoRFDYM7Z",
// 	//         "type": "payment_intent",
// 	//         "attributes": {
// 	//           "amount": 10000,
// 	//           "capture_type": "automatic",
// 	//           "client_key": "pi_yKL8nm3RGyqUJVBMoRFDYM7Z_client_qzNjSh1vkJarV9gSrNaYCf91",
// 	//           "currency": "PHP",
// 	//           "description": "Reservation",
// 	//           "livemode": false,
// 	//           "statement_descriptor": "Jakelou",
// 	//           "status": "awaiting_payment_method",
// 	//           "last_payment_error": null,
// 	//           "payment_method_allowed": [
// 	//             "gcash"
// 	//           ],
// 	//           "payments": [],
// 	//           "next_action": null,
// 	//           "payment_method_options": null,
// 	//           "metadata": null,
// 	//           "setup_future_usage": null,
// 	//           "created_at": 1703844217,
// 	//           "updated_at": 1703844217
// 	//         }
// 	//       },
// 	//       "payment_method_types": [
// 	//         "gcash"
// 	//       ],
// 	//       "reference_number": null,
// 	//       "send_email_receipt": false,
// 	//       "show_description": true,
// 	//       "show_line_items": true,
// 	//       "status": "active",
// 	//       "success_url": null,
// 	//       "created_at": 1703844217,
// 	//       "updated_at": 1703844217,
// 	//       "metadata": null
// 	//     }
// 	//   }
// 	// }
// 	// .then(response => response.json())
// 	// .then(response => console.log(response))
// 	// .catch(err => console.error(err));
// }
