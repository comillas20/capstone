"use client";

import { Button } from "@components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ExcelJS from "exceljs";
import { useState, useTransition } from "react";
import { DCC, Service, Set, WorksheetNames } from "./types";
import { Loader2 } from "lucide-react";
import {
	restoreDishCatCourse,
	restoreServices,
	restoreSets,
} from "./serverActions";
import { convertExcelValueToDateString } from "@lib/utils";

const uploadFormSchema = z.object({
	uploadFile: z.custom(file => file instanceof File, {
		message: "No file is selected",
	}),
});
type UploadFormValues = z.infer<typeof uploadFormSchema>;

export default function RestoreBackUpForm() {
	const form = useForm<UploadFormValues>({
		resolver: zodResolver(uploadFormSchema),
		defaultValues: {
			uploadFile: undefined,
		},
	});

	const [isUploading, startUploading] = useTransition();
	const [message, setMessage] = useState<string>();
	function onSubmit(values: UploadFormValues) {
		startUploading(async () => {
			try {
				setMessage("Opening the file...");
				const file: File = values.uploadFile as File;
				const workbook = new ExcelJS.Workbook();
				const arrayBuffer = await file.arrayBuffer();
				await workbook.xlsx.load(arrayBuffer);

				setMessage("Reading the file...");
				const dishes = getDishesFromExcel(workbook);
				const sets = getSetsFromExcel(workbook);
				const services = getServicesFromExcel(workbook);
				// insert other worksheets here

				if (dishes) {
					dishes.forEach(async (dish, index) => {
						const dishUpload = await restoreDishCatCourse(dish);
						if (dishUpload) {
							setMessage("Uploading dishes (" + index + "/" + dishes.length + ")");
						}
					});
				}
				if (sets) {
					sets.forEach(async (set, index) => {
						const setUpload = await restoreSets(set);
						if (setUpload) {
							setMessage("Uploading sets (" + index + "/" + sets.length + ")");
						}
					});
				}
				if (services) {
					services.forEach(async (service, index) => {
						const serviceUpload = await restoreServices(service);
						if (serviceUpload) {
							setMessage(
								"Uploading other services (" + index + "/" + services.length + ")"
							);
						}
					});
				}
				// Note to self: all code here will be executed first before uploading
			} catch (err) {
				// will catch an error if file is invalid
				setMessage("Invalid File");
			}
		});
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				encType="multipart/form-data"
				className="flex flex-col space-y-8">
				<FormField
					control={form.control}
					name="uploadFile"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Upload backup file (.xlsx)</FormLabel>
							<FormControl>
								<Input
									type="file"
									onChange={e => {
										if (!e?.target?.files) return;
										else field.onChange(e.target.files[0]);
									}}
									accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex items-center space-x-4 self-end">
					{message && isUploading && (
						<p className="text-sm font-medium text-destructive">{message}</p>
					)}
					<Button type="submit" disabled={isUploading || !form.formState.isDirty}>
						{isUploading && <Loader2 className="mr-2 animate-spin" />}
						Upload
					</Button>
				</div>
			</form>
		</Form>
	);
}

function getDishesFromExcel(workbook: ExcelJS.Workbook) {
	const worksheet = workbook.getWorksheet(WorksheetNames.DCC);
	if (!worksheet) return null;
	let dishes: DCC[] = [];
	worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
		if (rowNumber > 1) {
			const name = row.getCell(1).value?.toString();
			const createdAtCell = row.getCell(2).value?.toString();
			const createdAt = createdAtCell
				? convertExcelValueToDateString(createdAtCell)
				: null;
			const isAvailable =
				row.getCell(3).value?.toString().toLowerCase() === "true";
			const category = row.getCell(4).value?.toString();
			const course = row.getCell(5).value?.toString();
			const imgHref = row.getCell(6).value?.toString();
			if (!name && !category && !course) return;
			const dish = {
				name: name as string,
				createdAt: createdAt ? new Date(createdAt) : new Date(),
				isAvailable: isAvailable,
				category: category as string,
				course: course as string,
				imgHref: imgHref ? (imgHref as string) : null,
			};
			dishes.push(dish);
		}
	});
	return dishes.length !== 0 ? dishes : null;
}

function getSetsFromExcel(workbook: ExcelJS.Workbook) {
	const worksheet = workbook.getWorksheet(WorksheetNames.Set);
	if (!worksheet) return null;
	let sets: Set[] = [];
	let currentSet: Set | undefined;
	let name: string | undefined,
		description: string | undefined,
		createdAtCell: string | undefined,
		createdAt: string | null,
		minimumPerHead: string | undefined,
		price: string | undefined,
		selectionQuantity: string | undefined,
		venue: string | undefined,
		location: string | undefined,
		freeHours: string | undefined,
		venueCost: string | undefined,
		maxCapacity: string | undefined,
		subset: string | undefined,
		course: string | undefined,
		dish: string | undefined,
		isAvailable: boolean,
		category: string | undefined,
		imgHref: string | undefined;
	worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
		if (rowNumber > 1) {
			name = row.getCell(1).value?.toString();
			description = row.getCell(2).value?.toString();
			createdAtCell = row.getCell(3).value?.toString();
			createdAt = createdAtCell
				? convertExcelValueToDateString(createdAtCell)
				: null;
			minimumPerHead = row.getCell(4).value?.toString();
			price = row.getCell(5).value?.toString();
			selectionQuantity = row.getCell(6).value?.toString();
			venue = row.getCell(7).value?.toString();
			location = row.getCell(8).value?.toString();
			freeHours = row.getCell(9).value?.toString();
			venueCost = row.getCell(10).value?.toString();
			maxCapacity = row.getCell(11).value?.toString();
			subset = row.getCell(12).value?.toString();
			course = row.getCell(13).value?.toString();
			dish = row.getCell(14).value?.toString();
			isAvailable = row.getCell(15).value?.toString().toLowerCase() === "true";
			category = row.getCell(16).value?.toString();
			imgHref = row.getCell(17).value?.toString();
			if (name && price && minimumPerHead && selectionQuantity) {
				// Push previous set, before it gets replaced by the new set below
				if (currentSet) sets.push(currentSet);
				currentSet = {
					name: name as string,
					description: description ? (description as string) : null,
					createdAt: createdAt ? new Date(createdAt) : new Date(),
					minimumPerHead: parseInt(minimumPerHead as string),
					price: parseFloat(price as string),
					selectionQuantity: parseInt(selectionQuantity as string),
					subSets: [
						{
							name: subset as string,
							course: course as string,
							dishes: [
								{
									name: dish as string,
									isAvailable: isAvailable as boolean,
									createdAt: new Date(),
									category: category as string,
									course: course as string,
									imgHref: imgHref ? (imgHref as string) : null,
								},
							],
						},
					],
					venue: {
						name: venue as string,
						location: location as string,
						freeHours: parseInt(freeHours as string),
						venueCost: parseFloat(venueCost as string),
						maxCapacity: parseInt(maxCapacity as string),
					},
				};
			} else if (!name && !price && !minimumPerHead && subset && course) {
				// NOTE: currentSet CANNOT BE undefined,
				// unless someone modified the excel and deleted all columns other than dishes
				// this else if block SHOULD RUN AFTER the if block is executed in the previous loop,
				// setting the currentSet's set
				if (!currentSet) return;
				currentSet.subSets.push({
					name: subset as string,
					course: course as string,
					dishes: [
						{
							name: dish as string,
							isAvailable: isAvailable as boolean,
							createdAt: new Date(),
							category: category as string,
							course: course as string,
							imgHref: imgHref ? (imgHref as string) : null,
						},
					],
				});
			} else if (
				!name &&
				!price &&
				!minimumPerHead &&
				!subset &&
				!course &&
				dish
			) {
				// NOTE: currentSet CANNOT BE undefined,
				// unless someone modified the excel and deleted all columns other than dishes
				// this else if block SHOULD RUN AFTER the else if block above is executed in the previous loop,
				// setting the currentSet's subSet
				if (!currentSet) return;
				const thisSubset = currentSet.subSets[currentSet.subSets.length - 1].dishes;
				currentSet.subSets[currentSet.subSets.length - 1].dishes.push({
					name: dish as string,
					isAvailable: isAvailable as boolean,
					createdAt: new Date(),
					category: category as string,
					// course doesn't exist in this line
					// so, copy the course from previous line

					// because course being undefined here means
					// this line and the previous line are on the same subSet (which means same course)
					course: thisSubset[thisSubset.length - 1].course,
					imgHref: imgHref ? (imgHref as string) : null,
				});
			}
		}
	});
	if (currentSet) sets.push(currentSet);
	return sets.length > 0 ? sets : null;
}

function getServicesFromExcel(workbook: ExcelJS.Workbook) {
	const worksheet = workbook.getWorksheet(WorksheetNames.Service);
	if (!worksheet) return null;
	let services: Service[] = [];
	worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
		if (rowNumber > 1) {
			const name = row.getCell(1).value?.toString();
			const price = row.getCell(2).value?.toString();
			const unit = row.getCell(3).value?.toString();
			const unitName = row.getCell(4).value?.toString();
			const isRequired = row.getCell(5).value?.toString().toLowerCase() === "true";
			const isAvailable =
				row.getCell(6).value?.toString().toLowerCase() === "true";
			if (!name && !price) return;
			const service: Service = {
				name: name as string,
				price: parseFloat(price as string),
				unit: unit ? parseInt(unit) : null,
				unitName: unitName ?? null,
				isRequired: isRequired,
				isAvailable: isAvailable,
			};
			services.push(service);
		}
	});
	return services.length !== 0 ? services : null;
}
