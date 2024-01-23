"use client";
import { Dishes, columns } from "./DishColumns";
import {
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";
import { DataTable } from "@app/(website)/admin/components/DataTable";
import { DataTableToolbar } from "./DataTableToolbar";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { AddEditDialog as CategoryAE } from "./CategoryAED";
import { AddEditDialog as CourseAE } from "./CourseAED";
import { useContext } from "react";
import EditableButtonText from "@components/EditableButtonText";
import { Plus } from "lucide-react";

export default function DishesPage() {
	const { dishes, categories, courses } = useContext(
		ProductPageContext
	) as ProductPageContextProps;
	const dishesTableData: Dishes[] = dishes.map(dish => ({
		...dish,
		categoryID: dish.category.id,
		category: dish.category.name,
	}));
	const hideOnDefault = { Created: false, "Last Updated": false };
	return (
		<div className="flex flex-col space-y-2">
			<div className="flex flex-col gap-6 pt-4 lg:grid lg:grid-cols-4">
				<div className="mt-12">
					<Card className="flex flex-col pt-4">
						<CardContent className="space-y-4">
							{courses.length > 0 ? (
								<>
									{courses.map(course => {
										return (
											<div key={course.id} className="space-y-2">
												<CourseAE key={course.id} data={course}>
													<EditableButtonText
														variant={"link"}
														size={"sm"}
														className="px-0 text-sm font-semibold"
														iconSize={15}
														iconClassName="text-primary"
														text={course.name}
													/>
												</CourseAE>
												{/* <h3 className="text-sm font-semibold">{course.name}</h3> */}
												<div className="ml-4 space-y-2">
													{(() => {
														// only takes the categories within te current course
														const filtered = categories.filter(
															category => category.course.id === course.id
														);
														return filtered.length > 0 ? (
															<>
																{filtered.map(category => (
																	<CategoryAE key={category.id} data={category}>
																		<EditableButtonText
																			variant={"link"}
																			size={"sm"}
																			className="h-fit w-full justify-start p-0"
																			iconSize={15}
																			iconClassName="text-primary"
																			text={category.name}
																		/>
																	</CategoryAE>
																))}
																<CategoryAE>
																	<Button
																		size="sm"
																		variant={"link"}
																		className="h-fit p-0 text-xs">
																		<Plus className="mr-1" size={15} />
																		New Category
																	</Button>
																</CategoryAE>
															</>
														) : (
															<CategoryAE>
																<Button
																	size="sm"
																	variant={"link"}
																	className="h-fit p-0 text-xs">
																	<Plus className="mr-1" size={15} />
																	New Category
																</Button>
															</CategoryAE>
														);
													})()}
												</div>
											</div>
										);
									})}
									<CourseAE>
										<Button size="sm" variant={"link"} className="h-fit p-0 text-xs">
											<Plus className="mr-1" size={15} />
											New Course
										</Button>
									</CourseAE>
								</>
							) : (
								<CourseAE>
									<Button size="sm" variant={"link"} className="h-fit p-0 text-xs">
										<Plus className="mr-1" />
										New Course
									</Button>
								</CourseAE>
							)}
						</CardContent>
					</Card>
				</div>
				<div className="col-span-3">
					<DataTable
						data={dishesTableData}
						columns={columns}
						Toolbar={DataTableToolbar}
						hideAsDefault={hideOnDefault}
					/>
				</div>
			</div>
		</div>
	);
}
