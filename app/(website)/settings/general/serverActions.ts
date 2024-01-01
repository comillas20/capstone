"use server";

import prisma from "@lib/db";

type AdminSettings = {
	id: number;
	openingTime: Date;
	closingTime: Date;
	minimumCustomerReservationHours: number;
	maximumCustomerReservationHours: number;
	defaultMinimumPerHead: number;
	reservationCostPerHour: number;
	maintainanceDates: Date[];
	faq: {
		id: number;
		question: string;
		answer: string;
	}[];
};
export async function saveSettings(settings: AdminSettings) {
	const as = await prisma.adminSettings.upsert({
		create: {
			openingTime: settings.openingTime,
			closingTime: settings.closingTime,
			defaultMinimumPerHead: settings.defaultMinimumPerHead,
			minimumCustomerReservationHours: settings.minimumCustomerReservationHours,
			maximumCustomerReservationHours: settings.maximumCustomerReservationHours,
			reservationCostPerHour: settings.reservationCostPerHour,
		},
		where: {
			id: settings.id,
		},
		update: {
			openingTime: settings.openingTime,
			closingTime: settings.closingTime,
			defaultMinimumPerHead: settings.defaultMinimumPerHead,
			minimumCustomerReservationHours: settings.minimumCustomerReservationHours,
			maximumCustomerReservationHours: settings.maximumCustomerReservationHours,
			reservationCostPerHour: settings.reservationCostPerHour,
		},
	});
	// have to put this inside an object first
	const mdArray: { date: Date }[] = settings.maintainanceDates.map(date => ({
		date: date,
	}));

	const [d, c] = await prisma.$transaction([
		prisma.maintainanceDates.deleteMany(),
		prisma.maintainanceDates.createMany({
			data: mdArray,
		}),
	]);

	const [g, f] = await prisma.$transaction([
		prisma.fAQ.deleteMany(),
		prisma.fAQ.createMany({
			data: settings.faq,
		}),
	]);

	return { ...as, ...c, ...f };
}
