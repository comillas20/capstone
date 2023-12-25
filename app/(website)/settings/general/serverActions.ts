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
			id: settings.id,
			openingTime: settings.openingTime,
			closingTime: settings.closingTime,
			defaultMinimumPerHead: settings.defaultMinimumPerHead,
			minimumCustomerReservationHours: settings.minimumCustomerReservationHours,
			maximumCustomerReservationHours: settings.maximumCustomerReservationHours,
			reservationCostPerHour: settings.reservationCostPerHour,
		},
	});
	const mdArray: { adminSettingsID: number; date: Date }[] =
		settings.maintainanceDates.map(date => ({
			adminSettingsID: as.id,
			date: date,
		}));

	const [d, c] = await prisma.$transaction([
		prisma.maintainanceDates.deleteMany(),
		prisma.maintainanceDates.createMany({
			data: mdArray,
		}),
	]);

	return { ...as, ...c };
}
