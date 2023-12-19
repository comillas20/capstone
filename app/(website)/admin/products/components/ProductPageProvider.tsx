"use client";
import { createContext } from "react";
import useSWR from "swr";
import {
	getAllCategories,
	getAllCourses,
	getAllDishes,
	getAllServices,
	getAllSets,
} from "@app/(website)/serverActionsGlobal";

export type ProductPageContextProps = {
	dishes: {
		id: number;
		name: string;
		createdAt: Date;
		updatedAt: Date;
		isAvailable: boolean;
		imgHref: string | null;
		category: {
			id: number;
			name: string;
		};
	}[];
	categories: {
		id: number;
		name: string;
		course: {
			id: number;
			name: string;
		};
	}[];
	courses: {
		id: number;
		name: string;
	}[];
	sets: {
		id: number;
		name: string;
		description: string | null;
		createdAt: Date;
		updatedAt: Date;
		minimumPerHead: number;
		price: number;
		subSets: {
			id: number;
			name: string;
			course: {
				id: number;
				name: string;
			};
			selectionQuantity: number;
			dishes: {
				id: number;
				name: string;
				isAvailable: boolean;
				category: {
					id: number;
					name: string;
				};
			}[];
		}[];
	}[];
	services: {
		id: number;
		name: string;
		price: number;
		duration: number | null;
		unit: number | null;
		isRequired: boolean;
		isAvailable: boolean;
	}[];
};

export const ProductPageContext = createContext<
	ProductPageContextProps | undefined
>(undefined);
export const PRODUCTS_DISHES_KEY = "products_dishes";
export const PRODUCTS_CATEGORIES_KEY = "products_categories";
export const PRODUCTS_COURSES_KEY = "products_courses";
export const PRODUCTS_SETS_KEY = "products_sets";
export const PRODUCTS_SERVICES_KEY = "products_services";

export default function ProductPageProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const dishes = useSWR(PRODUCTS_DISHES_KEY, getAllDishes);
	const categories = useSWR(PRODUCTS_CATEGORIES_KEY, getAllCategories);
	const courses = useSWR(PRODUCTS_COURSES_KEY, getAllCourses);
	const sets = useSWR(PRODUCTS_SETS_KEY, getAllSets);
	const services = useSWR(PRODUCTS_SERVICES_KEY, getAllServices);
	return (
		<ProductPageContext.Provider
			value={{
				dishes: dishes.data ?? [],
				categories: categories.data ?? [],
				courses: courses.data ?? [],
				sets: sets.data ?? [],
				services: services.data ?? [],
			}}>
			{children}
		</ProductPageContext.Provider>
	);
}
