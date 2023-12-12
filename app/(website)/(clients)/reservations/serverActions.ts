"use server";
import prisma from "@lib/db";

type Reservation = {
	eventDate: Date;
	userID: String;
	totalPrice: number;
	eventDuration: number;
	orders: {
		id: Number;
		name: string;
		price: number;
	}[];
};
export async function createReservation() {}
