"use server";
import prisma from "@lib/db";

export async function getAllSets() {
	const sets = await prisma.set.findMany({
		select: {
			id: true,
			name: true,
			subSets: {
				select: {
					name: true,
					dishes: {
						select: {
							id: true,
							name: true,
							category: true,
							course: true,
							isAvailable: true,
							price: true,
						},
					},
				},
			},
		},
	});

	return sets;
}

export async function getAllCategories() {
	const categories = await prisma.category.findMany();
	return categories;
}

export async function getAllCourses() {
	return await prisma.course.findMany();
}

//temp
// export async function create() {
// 	const categories = await prisma.category.createMany({
// 		data: [
// 			{ name: "Pork" },
// 			{ name: "Chicken" },
// 			{ name: "Fish" },
// 			{ name: "Canton" },
// 			{ name: "Vegetables" },
// 			{ name: "Beef" },
// 		],
// 	});

// 	const course = await prisma.course.createMany({
// 		data: [{ name: "Main Dishes" }, { name: "Dessert" }],
// 	});

// 	console.log("categories: " + JSON.stringify(categories));
// 	console.log("course: " + JSON.stringify(course));

// 	const get = await prisma.category.findMany();
// 	console.log("cate: " + JSON.stringify(get));
// }

// export async function create2() {
// 	const porks = await prisma.dish.createMany({
// 		data: [
// 			{
// 				name: "Pork Ribs",
// 				categoryID: 1,
// 				courseID: 1,
// 				isAvailable: true,
// 				price: 1000,
// 			},
// 			{
// 				name: "Pork Steak Kaldereta",
// 				categoryID: 1,
// 				courseID: 1,
// 				isAvailable: true,
// 				price: 1000,
// 			},
// 			{
// 				name: "Sweet & Sour Pork",
// 				categoryID: 1,
// 				courseID: 1,
// 				isAvailable: true,
// 				price: 1000,
// 			},
// 			{
// 				name: "Sweet & Sour Meatballs",
// 				categoryID: 1,
// 				courseID: 1,
// 				isAvailable: true,
// 				price: 1000,
// 			},
// 		],
// 	});

// 	const chicken = await prisma.dish.createMany({
// 		data: [
// 			{
// 				name: "Battered Fried Chicken",
// 				categoryID: 2,
// 				courseID: 1,
// 				isAvailable: true,
// 				price: 1000,
// 			},
// 			{
// 				name: "Garlic Chicken",
// 				categoryID: 2,
// 				courseID: 1,
// 				isAvailable: true,
// 				price: 1000,
// 			},
// 			{
// 				name: "Chicken Adobo",
// 				categoryID: 2,
// 				courseID: 1,
// 				isAvailable: true,
// 				price: 1000,
// 			},
// 			{
// 				name: "Chicken Curry",
// 				categoryID: 2,
// 				courseID: 1,
// 				isAvailable: true,
// 				price: 1000,
// 			},
// 		],
// 	});

// 	const fish = await prisma.dish.createMany({
// 		data: [
// 			{
// 				name: "Breaded Fish Fillet",
// 				categoryID: 3,
// 				courseID: 1,
// 				isAvailable: true,
// 				price: 1000,
// 			},
// 			{
// 				name: "Sweet & Sour Fish",
// 				categoryID: 3,
// 				courseID: 1,
// 				isAvailable: true,
// 				price: 1000,
// 			},
// 			{
// 				name: "Fish Tausi",
// 				categoryID: 3,
// 				courseID: 1,
// 				isAvailable: true,
// 				price: 1000,
// 			},
// 		],
// 	});

// 	// const sets = await prisma.set.createMany({
// 	// 	data: [
// 	// 		{
// 	// 			name: "₱220/Head",
// 	// 		},
// 	// 		{
// 	// 			name: "₱250/Head",
// 	// 		},
// 	// 		{
// 	// 			name: "₱350/Head",
// 	// 		},
// 	// 		{
// 	// 			name: "₱420/Head",
// 	// 		},
// 	// 	],
// 	// });

// 	// const subSets = await prisma.subSets.createMany({
// 	// 	data: [
// 	// 		{
// 	// 			setID: 1,
// 	// 			name: "Pork",
// 	// 		},
// 	// 		{
// 	// 			setID: 1,
// 	// 			name: "Chicken",
// 	// 		},
// 	// 		{
// 	// 			setID: 1,
// 	// 			name: "Fish",
// 	// 		},
// 	// 	],
// 	// });

// 	console.log("porks: " + JSON.stringify(porks));
// 	console.log("chicken: " + JSON.stringify(chicken));
// 	console.log("fish: " + JSON.stringify(fish));
// 	// console.log("sets: " + JSON.stringify(sets));
// 	// console.log("subSets: " + JSON.stringify(subSets));
// }

// export async function create() {
// 	await prisma.reservations.deleteMany({});

// 	// Delete data in Orders model
// 	await prisma.orders.deleteMany({});

// 	// Delete data in Dish model
// 	await prisma.dish.deleteMany({});

// 	// Delete data in Category model
// 	// await prisma.category.deleteMany({});

// 	// Delete data in Course model
// 	// await prisma.course.deleteMany({});

// 	// Delete data in Set model
// 	await prisma.set.deleteMany({});

// 	// Delete data in SubSets model
// 	await prisma.subSets.deleteMany({});

// 	// Delete data in User model
// 	await prisma.user.deleteMany({});

// 	// Delete data in UserPreference model
// 	await prisma.userPreference.deleteMany({});

// 	// Delete data in OtherServices model
// 	await prisma.otherServices.deleteMany({});

// 	const t = prisma.category.findMany();
// 	console.log(JSON.stringify(t));
// }

// await prisma.dish.update({
// 	where: { id: 55 },
// 	data: { subSet: { connect: { id: 18 } } },
// });
