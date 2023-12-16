"use server";

import prisma from "@lib/db";
import cloudinary from "cloudinary";
type Dish = {
	id: number;
	name: string;
	imgHref: string | undefined;
	categoryID: number;
	courseID: number;
	isAvailable: string;
};

enum isAvailable {
	true = "Available",
	false = "N/A",
}

export async function createOrUpdateDish(dish: Dish) {
	return await prisma.dish.upsert({
		create: {
			name: dish.name,
			imgHref: dish.imgHref,
			isAvailable: dish.isAvailable === isAvailable.true,
			categoryID: dish.categoryID,
			courseID: dish.courseID,
		},
		where: {
			id: dish.id,
		},
		update: {
			name: dish.name,
			imgHref: dish.imgHref,
			category: {
				connect: {
					id: dish.categoryID,
				},
			},
			course: {
				connect: {
					id: dish.courseID,
				},
			},
			isAvailable: dish.isAvailable === isAvailable.true,
		},
	});
}

export async function saveDishImage(
	dishName: string,
	oldPublicID: string | null,
	newPublicID: string
) {
	if (oldPublicID) {
		const deleteImg = await deleteImages([oldPublicID]);
	}
	return await prisma.dish.update({
		data: {
			imgHref: newPublicID,
		},
		where: {
			name: dishName,
		},
	});
}

async function deleteImages(public_ids: string[]) {
	cloudinary.v2.config({
		cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	try {
		const deleteResult = await cloudinary.v2.api.delete_resources(public_ids);
	} catch (error) {
		console.error(error);
	}
}

type dishAndImages = { id: number; imgHref: string }[];
export async function deleteDishes(
	dishes: { id: number; imgHref: string | null }[]
) {
	const yeetedDishes = await prisma.dish.deleteMany({
		where: {
			id: {
				in: dishes.map(dish => dish.id),
			},
		},
	});

	const noNulls = (
		dishes.filter(dish => dish.imgHref !== null) as dishAndImages
	).map(dish => dish.imgHref);
	const yeetImage = await deleteImages(noNulls);

	return yeetedDishes;
}

type CategoryOrCourse = {
	id: number;
	name: string;
};
export async function createOrUpdateCategoryOrCourse(
	data: CategoryOrCourse,
	isCategory: boolean
) {
	return isCategory
		? await prisma.category.upsert({
				create: {
					name: data.name,
				},
				where: {
					id: data.id,
				},
				update: {
					name: data.name,
				},
		  })
		: await prisma.course.upsert({
				create: {
					name: data.name,
				},
				where: {
					id: data.id,
				},
				update: {
					name: data.name,
				},
		  });
}

export async function deleteCategory(id: number) {
	return await prisma.category.delete({
		where: {
			id: id,
		},
	});
}

export async function deleteCourse(id: number) {
	return await prisma.course.delete({
		where: {
			id: id,
		},
	});
}
type Set = {
	id: number;
	name: string;
	description: string | null;
	minimumPerHead: number;
	price: number;
};
export async function createOrUpdateSet(values: Set) {
	return await prisma.set.upsert({
		create: {
			name: values.name,
			description: values.description,
			minimumPerHead: values.minimumPerHead,
			price: values.price,
		},
		where: {
			id: values.id,
		},
		update: {
			name: values.name,
			description: values.description,
			minimumPerHead: values.minimumPerHead,
			price: values.price,
		},
	});
}
export async function doesSetExists(name: string) {
	return !!(await prisma.set.findUnique({ where: { name: name } }));
}

export async function deleteSet(id: number) {
	return await prisma.set.delete({
		where: {
			id: id,
		},
	});
}

// await prisma.dish.update({
// 	where: { id: 55 },
// 	data: { subSet: { connect: { id: 18 } } },
// });

type subset = {
	id: number;
	name: string;
	setID: number;
	dishes: number[];
	courseID: number;
	selectionQuantity: number;
};
export async function createOrUpdateSubset(subset: subset) {
	return await prisma.subSet.upsert({
		create: {
			name: subset.name,
			courseID: subset.courseID,
			setID: subset.setID,
			dishes: {
				connect: subset.dishes.map(dishID => ({ id: dishID })),
			},
			selectionQuantity: subset.selectionQuantity,
		},
		where: {
			id: subset.id,
		},
		update: {
			name: subset.name,
			courseID: subset.courseID,
			setID: subset.setID,
			dishes: {
				disconnect: [],
				connect: subset.dishes.map(dishID => ({ id: dishID })),
			},
			selectionQuantity: subset.selectionQuantity,
		},
		include: {
			dishes: true,
			set: true,
			course: true,
		},
	});
}

export async function getAllSubSetsInASet(setID: number) {
	return await prisma.subSet.findMany({
		include: {
			dishes: true,
		},
		where: {
			setID: setID,
		},
	});
}
export async function deleteSubset(id: number) {
	return await prisma.subSet.delete({
		where: { id: id },
	});
}

// async function addDishToSubSet() {
// 	await prisma.dish.update({
// 		where: { id: 55 },
// 		data: { subSet: { connect: { id: 18 } } },
// 	});
// }

export async function isSubSetAlreadyExistsInASet(setID: number, name: string) {
	const result = await prisma.set.findUnique({
		select: {
			subSets: {
				select: {
					name: true,
				},
			},
		},
		where: {
			id: setID,
		},
	});

	return !!result?.subSets.find(subSet => subSet.name === name);
}
