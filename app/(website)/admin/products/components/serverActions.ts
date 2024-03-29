"use server";
import prisma from "@lib/db";

type Dish = {
	id: number;
	name: string;
	imgHref: string | undefined;
	image: FormData | undefined;
	categoryID: number;
	isAvailable: boolean;
};
export async function createOrUpdateDish(dish: Dish) {
	if (dish.image) {
		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
			{
				method: "POST",
				body: dish.image,
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
	}

	return await prisma.dish.upsert({
		create: {
			name: dish.name,
			imgHref: dish.image ? dish.imgHref : undefined,
			isAvailable: dish.isAvailable,
			categoryID: dish.categoryID,
		},
		where: {
			id: dish.id,
		},
		update: {
			name: dish.name,
			imgHref: dish.image ? dish.imgHref : undefined,
			category: {
				connect: {
					id: dish.categoryID,
				},
			},
			isAvailable: dish.isAvailable,
		},
	});
}

export async function uploadImage(formData: FormData) {
	const response = await fetch(
		`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
		{
			method: "POST",
			body: formData,
		}
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const data = await response.json();
	return data.secure_url;
}

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
	return yeetedDishes;
}

type Course = {
	id: number;
	name: string;
};
export async function createOrUpdateCourse(data: Course) {
	return await prisma.course.upsert({
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

export async function deleteCourse(id: number) {
	return await prisma.course.delete({
		where: {
			id: id,
		},
	});
}

type Category = {
	id: number;
	name: string;
	courseID: number;
};
export async function createOrUpdateCategory(data: Category) {
	return await prisma.category.upsert({
		create: {
			name: data.name,
			courseID: data.courseID,
		},
		where: {
			id: data.id,
		},
		update: {
			name: data.name,
			courseID: data.courseID,
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

type Set = {
	id: number;
	name: string;
	description: string | null;
	minimumPerHead: number;
	price: number;
	selectionQuantity: number;
	venueID: number;
};
export async function createOrUpdateSet(values: Set) {
	return await prisma.set.upsert({
		create: {
			name: values.name,
			description: values.description,
			minimumPerHead: values.minimumPerHead,
			price: values.price,
			selectionQuantity: values.selectionQuantity,
			venueID: values.venueID,
		},
		where: {
			id: values.id,
		},
		update: {
			name: values.name,
			description: values.description,
			minimumPerHead: values.minimumPerHead,
			price: values.price,
			selectionQuantity: values.selectionQuantity,
			venueID: values.venueID,
		},
	});
}

export async function deleteSet(id: number) {
	return await prisma.set.delete({
		where: {
			id: id,
		},
	});
}

type subset = {
	id: number;
	name: string;
	setID: number;
	dishes: number[];
	courseID: number;
};
export async function createOrUpdateSubset(subset: subset) {
	return await prisma.subSets.upsert({
		create: {
			name: subset.name,
			courseID: subset.courseID,
			setID: subset.setID,
			dishes: {
				connect: subset.dishes.map(dishID => ({ id: dishID })),
			},
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
		},
		include: {
			dishes: true,
			set: true,
			course: true,
		},
	});
}

export async function deleteSubset(id: number) {
	return await prisma.subSets.delete({
		where: { id: id },
	});
}

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
// 	console.log(!!result);
// 	return !!result?.subSets.find(subSet => subSet.name === name);
// }

export type Service = {
	id: number;
	name: string;
	price: number;
	unit: number | null;
	unitName: string | null;
	isAvailable: boolean;
};
export async function createOrUpadteServices(service: Service) {
	return await prisma.otherServices.upsert({
		create: {
			name: service.name,
			price: service.price,
			unit: service.unit,
			unitName: service.unitName,
			isAvailable: service.isAvailable,
		},
		where: {
			id: service.id,
		},
		update: {
			name: service.name,
			price: service.price,
			unit: service.unit,
			unitName: service.unitName,
			isAvailable: service.isAvailable,
		},
	});
}

export async function deleteServices(ids: number[]) {
	// return await prisma.otherServices.deleteMany({
	// 	where: {
	// 		id: {
	// 			in: ids,
	// 		},
	// 	},
	// });
	return await prisma.otherServices.updateMany({
		data: {
			isAvailable: false,
		},
		where: {
			id: {
				in: ids,
			},
		},
	});
}
