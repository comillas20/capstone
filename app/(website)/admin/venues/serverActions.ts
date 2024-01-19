"use server";

import prisma from "@lib/db";

type VenueData = {
	id: number;
	name: string;
	location: string;
	freeHours: number;
	venueCost: number;
	maxCapacity: number;
};
export async function createOrUpdateVenue(data: VenueData) {
	return await prisma.venues.upsert({
		create: {
			name: data.name,
			location: data.location,
			freeHours: data.freeHours,
			venueCost: data.venueCost,
			maxCapacity: data.maxCapacity,
		},
		where: {
			id: data.id,
		},
		update: {
			name: data.name,
			location: data.location,
			freeHours: data.freeHours,
			venueCost: data.venueCost,
			maxCapacity: data.maxCapacity,
		},
	});
}

// export async function deleteVenue(id: number) {
// 	return await prisma.venues.delete({
// 		where: {
// 			id: id,
// 		},
// 	});
// }
export async function switchVenueAvailability(
	id: number,
	isAvailable: boolean
) {
	return await prisma.venues.update({
		data: {
			isAvailable: !isAvailable,
		},
		where: {
			id: id,
		},
	});
}

export async function updateMaintainanceDates(dates: Date[], venueID: number) {
	const [d, c] = await prisma.$transaction([
		prisma.maintainanceDates.deleteMany({
			where: {
				venueID: venueID,
			},
		}),
		prisma.maintainanceDates.createMany({
			data: dates.map(d => ({ date: d, venueID: venueID })),
		}),
	]);
	return c;
}
