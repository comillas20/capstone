"use client";
import { Dishes, columns } from "./DishColumns";
import useSWR from "swr";
import {
	getAllCategories,
	getAllCourses,
	getAllDishes,
} from "../serverActions";
import { convertDateToString } from "@lib/utils";
import { isAvailable } from "../../page";
import { DataTable } from "@app/admin/components/DataTable";
import { DataTableToolbar } from "./DataTableToolbar";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import CategoryCourseDialog from "./CategoryCourseDialog";
import { useState } from "react";

export default function DishesPage() {
	const dishes = useSWR("dpGetAllDishes", async () => {
		const d = await getAllDishes();
		const dishes: Dishes[] = d.map(dish => ({
			id: dish.id,
			name: dish.name,
			categoryID: dish.category.id,
			category: dish.category.name,
			courseID: dish.course.id,
			course: dish.course.name,
			createdAt: convertDateToString(dish.createdAt),
			updatedAt: convertDateToString(dish.updatedAt),
			isAvailable: dish.isAvailable ? isAvailable.true : isAvailable.false,
			price: dish.price,
		}));
		return dishes;
	});
	const categories = useSWR("dpGetAllCategories", getAllCategories);
	const courses = useSWR("dpGetAllCourses", getAllCourses);
	// const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
	// const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
	// const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
	// const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
	//Had to do this to bypass TS type check, @data will only be undefined during loading (e.g. slow internet)
	const d2 = dishes.data ? dishes.data : [];
	return (
		<div className="flex flex-col space-y-2">
			<div className="flex gap-6 pt-4">
				<div className="mt-12">
					<Card className="flex flex-col pt-4">
						<CardContent className="flex flex-1 justify-center">
							<div>
								<h3 className="mb-3 text-sm font-semibold">Categories</h3>
								<div className="flex flex-col space-y-1">
									{categories.data &&
										categories.data.map(category => (
											<div key={category.id}>
												<CategoryCourseDialog editData={category} isCategory={true}>
													<Button
														variant={"link"}
														size={"sm"}
														className="h-fit w-full justify-start p-0">
														{category.name}
													</Button>
												</CategoryCourseDialog>
											</div>
										))}
								</div>
							</div>
							<Separator orientation="vertical" className="mx-4 h-auto" />
							<div>
								<h3 className="mb-3 text-sm font-semibold">Courses</h3>
								<div className="flex flex-col space-y-1">
									{courses.data &&
										courses.data.map(course => (
											<div key={course.id}>
												<CategoryCourseDialog editData={course} isCategory={false}>
													<Button
														variant={"link"}
														size={"sm"}
														className="h-fit w-full justify-start p-0">
														{course.name}
													</Button>
												</CategoryCourseDialog>
											</div>
										))}
								</div>
							</div>
						</CardContent>
						<Separator />
						<CardFooter className="flex justify-center gap-4 py-0">
							<CategoryCourseDialog isCategory={true}>
								<Button size="sm" variant={"link"} className="flex p-0 ">
									<span className="text-xs">New Category</span>
								</Button>
							</CategoryCourseDialog>
							<CategoryCourseDialog isCategory={false}>
								<Button size="sm" variant={"link"} className="flex p-0">
									<span className="text-xs">New Course</span>
								</Button>
							</CategoryCourseDialog>
						</CardFooter>
					</Card>
				</div>
				<div className="flex-1">
					<DataTable data={d2} columns={columns} Toolbar={DataTableToolbar} />
				</div>
			</div>
		</div>
	);
}
