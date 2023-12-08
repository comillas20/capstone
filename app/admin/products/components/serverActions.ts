"use server";

import prisma from "@lib/db";
import cloudinary from "cloudinary";
type Dish = {
	id: number;
	name: string;
	categoryID: number;
	courseID: number;
	isAvailable: string;
};

enum isAvailable {
	true = "Available",
	false = "N/A",
}

export async function createDish(dish: Dish) {
	const newDish = await prisma.dish.create({
		data: {
			name: dish.name,
			isAvailable: dish.isAvailable === isAvailable.true,
			categoryID: dish.categoryID,
			courseID: dish.courseID,
		},
	});

	return newDish;
}
export async function editDish(dish: Dish) {
	const newDish = await prisma.dish.update({
		data: {
			name: dish.name,
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
		where: {
			id: dish.id,
		},
	});

	return newDish;
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
	// example: "jakelou/vqupf6q5jlqzxu0rkadm.png"
	console.log(public_ids);

	cloudinary.v2.config({
		cloud_name: "dd16nlxbl",
		api_key: "985514274842282",
		api_secret: "yHRVWlXZDIy-MzMa8whumfLwHkM",
	});
	try {
		const deleteResult = await cloudinary.v2.api.delete_resources(public_ids);
		console.log(deleteResult);
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
	// example: "jakelou/vqupf6q5jlqzxu0rkadm.docx"
	const yeetImage = await deleteImages(noNulls);

	return yeetedDishes;
}

export async function getAllDishes() {
	const dishes = await prisma.dish.findMany({
		select: {
			id: true,
			name: true,
			category: {
				select: {
					id: true,
					name: true,
				},
			},
			course: true,
			createdAt: true,
			updatedAt: true,
			isAvailable: true,
			imgHref: true,
		},
	});

	return dishes;
}
type categoryCourse = {
	id: number;
	name: string;
};
export async function createCategory(category: string) {
	return await prisma.category.create({
		data: {
			name: category,
		},
	});
}
export async function editCategory(data: categoryCourse) {
	return await prisma.category.update({
		data: {
			name: data.name,
		},
		where: {
			id: data.id,
		},
	});
}
export async function getAllCategories() {
	return await prisma.category.findMany();
}
export async function deleteCategory(id: number) {
	return await prisma.category.delete({
		where: {
			id: id,
		},
	});
}

export async function createCourse(course: string) {
	return await prisma.course.create({
		data: {
			name: course,
		},
	});
}
export async function editCourse(data: categoryCourse) {
	return await prisma.course.update({
		data: {
			name: data.name,
		},
		where: {
			id: data.id,
		},
	});
}
export async function getAllCourses() {
	return await prisma.course.findMany();
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
	minimumPerHead: number;
	price: number;
};
export async function createSet(values: Set) {
	return await prisma.set.create({
		data: {
			name: values.name,
			minimumPerHead: values.minimumPerHead,
			price: values.price,
		},
	});
}
export async function editSet(values: Set) {
	return await prisma.set.update({
		data: {
			name: values.name,
			minimumPerHead: values.minimumPerHead,
			price: values.price,
		},
		where: {
			id: values.id,
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
	name: string | null;
	setID: number;
	dishes: number[];
	courseID: number;
	selectionQuantity: number;
};
export async function createSubset(subset: subset) {
	return await prisma.subSet.create({
		data: {
			name: subset.name,
			courseID: subset.courseID,
			setID: subset.setID,
			dishes: {
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
export async function editSubset(subset: subset) {
	return await prisma.subSet.update({
		data: {
			name: subset.name,
			courseID: subset.courseID,
			setID: subset.setID,
			dishes: {
				disconnect: [],
				connect: subset.dishes.map(dishID => ({ id: dishID })),
			},
			selectionQuantity: subset.selectionQuantity,
		},
		where: {
			id: subset.id,
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

// export async function isSubSetAlreadyExistsInASet(setID: number, name: string) {
// 	const result = await prisma.set.findUnique({
// 		select: {
// 			subSets: {
// 				select: {
// 					name: true,
// 				},
// 			},
// 		},
// 		where: {
// 			id: setID,
// 		},
// 	});

// 	return !!result?.subSets.find(subSet => subSet.name === name);
// }
