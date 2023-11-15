"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Dishes = {
	id: number;
	name: string;
	category: string;
	course: string;
	createdAt: string;
	updatedAt: string;
	isAvailable: "Available" | "N/A";
	price: number;
};

export const columns: ColumnDef<Dishes>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Dish name",
	},
	{
		accessorKey: "category",
		header: "Category",
	},
	{
		accessorKey: "course",
		header: "Course",
	},
	{
		accessorKey: "createdAt",
		header: "Created",
	},
	{
		accessorKey: "updatedAt",
		header: "Last Updated",
	},
	{
		accessorKey: "isAvailable",
		header: "Availability",
	},
	{
		accessorKey: "price",
		header: "Price/Pack",
	},
];
