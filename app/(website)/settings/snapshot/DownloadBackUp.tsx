"use client";
import { Button } from "@components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "@components/ui/dialog";
import { Separator } from "@components/ui/separator";
import { Dialog, DialogClose } from "@radix-ui/react-dialog";
import saveAs from "file-saver";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import ExcelJS from "exceljs";
import { Form, FormControl, FormField, FormItem } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckboxWithText } from "@components/CheckboxWithText";
import {
	retrieveAllDishCatCoursesForBackUp,
	retrieveSetsForBackUp,
} from "./serverActions";
import { DCC, WorksheetNames } from "./types";

const optionsSchema = z.object({
	dishCatCourses: z.boolean(),
	sets: z.boolean(),
	transactions: z.boolean(),
	reports: z.boolean(),
});
type Options = z.infer<typeof optionsSchema>;
export default function DownloadBackUp() {
	const form = useForm<Options>({
		resolver: zodResolver(optionsSchema),
		defaultValues: {
			dishCatCourses: true,
			sets: true,
			transactions: true,
			reports: true,
		},
	});
	const [isDownloading, startDownload] = useTransition();
	const [message, setMessage] = useState<string>();
	function onSubmit(options: Options) {
		const { dishCatCourses, sets, reports, transactions } = options;
		startDownload(async () => {
			// Create workbook and worksheet
			const workbook = new ExcelJS.Workbook();
			if (dishCatCourses) {
				setMessage("Downloading all dishes...");
				const dcc = await retrieveAllDishCatCoursesForBackUp();
				createDCCWorksheet(dcc, workbook);
			}
			if (sets) {
				setMessage("Downloading all sets...");
				const sets = await retrieveSetsForBackUp();
				createSetWorksheet(sets, workbook);
			}

			setMessage("Writing all data in excel...");
			// Write the Excel file to a buffer
			const buffer = await workbook.xlsx.writeBuffer();
			// Create a Blob from the Buffer
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});

			saveAs(blob, "jakelou.xlsx");
		});
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="space-y-2">
					<p className="text-sm font-medium">Back up files</p>
					<Button>Back up files</Button>
				</div>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="space-y-2">
					<h4 className="font-medium leading-none">Back up files</h4>
					<p className="text-sm text-muted-foreground">Back up data for later use</p>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="dishCatCourses"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<CheckboxWithText
											onCheckedChange={field.onChange}
											checked={field.value}>
											Products/Dishes
										</CheckboxWithText>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="sets"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<CheckboxWithText
											onCheckedChange={field.onChange}
											checked={field.value}>
											Sets
										</CheckboxWithText>
									</FormControl>
								</FormItem>
							)}
						/>
						<Separator />
						<FormField
							control={form.control}
							name="transactions"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<CheckboxWithText
											onCheckedChange={field.onChange}
											checked={field.value}>
											Transactions
										</CheckboxWithText>
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter className="flex space-x-0 space-y-2 sm:flex-col">
							<div className="flex justify-end space-x-2">
								<DialogClose asChild>
									<Button type="button" variant={"ghost"}>
										Cancel
									</Button>
								</DialogClose>

								<Button type="submit" disabled={isDownloading}>
									{isDownloading && <Loader2 className="mr-2 animate-spin" />}Download
								</Button>
							</div>
							{isDownloading && (
								<p className="self-center text-sm font-medium text-destructive">
									{message}
								</p>
							)}
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
async function createDCCWorksheet(data: DCC[], workbook: ExcelJS.Workbook) {
	const dishesSheet = workbook.addWorksheet(WorksheetNames.DCC);
	dishesSheet.columns = [
		{ header: "Name", key: "name", width: 20 },
		{ header: "Date Created", key: "createdAt", width: 20 },
		{ header: "Availability", key: "isAvailable", width: 10 },
		{ header: "Category", key: "category", width: 20 },
		{ header: "Course", key: "course", width: 20 },
		{ header: "imgHref", key: "imgHref", width: 20 },
	];

	dishesSheet.addRows(data);
}
// the set type from server
// different from the set type from types.ts
type Set = {
	name: string;
	description: string | null;
	createdAt: Date;
	minimumPerHead: number;
	price: number;
	subSets: {
		name: string | null;
		course: string;
		dishes: {
			name: string;
			isAvailable: boolean;
			imgHref: string | null;
			category: string;
		}[];
		selectionQuantity: number;
	}[];
}[];
async function createSetWorksheet(data: Set, workbook: ExcelJS.Workbook) {
	const setsSheet = workbook.addWorksheet(WorksheetNames.Set);
	setsSheet.columns = [
		{ header: "Name", key: "name", width: 20 },
		{ header: "Description", key: "description", width: 20 },
		{ header: "Date Created", key: "createdAt", width: 20 },
		{ header: "Minimum Packs", key: "minimumPerHead", width: 20 },
		{ header: "Price/Head", key: "price", width: 20 },
		{ header: "Subsets", key: "subsetName", width: 20 },
		{ header: "Course", key: "course", width: 20 },
		{ header: "selectionQuantity", key: "selectionQuantity", width: 20 },
		{ header: "Dishes", key: "dishes", width: 20 },
		{ header: "Availability", key: "isAvailable", width: 10 },
		{ header: "Category", key: "category", width: 20 },
		{ header: "imgHref", key: "imgHref", width: 20 },
	];

	data.forEach(set => {
		const setData = {
			name: set.name,
			description: set.description,
			createdAt: set.createdAt,
			minimumPerHead: set.minimumPerHead,
			price: set.price,
		};

		for (let ssIndex = 0; ssIndex < set.subSets.length; ssIndex++) {
			const ssData = {
				// if this is the first row for this set, add the set data
				// making the set data on the same line as the first subset data
				...(ssIndex === 0 ? setData : {}),
				subsetName: set.subSets[ssIndex].name,
				course: set.subSets[ssIndex].course,
				selectionQuantity: set.subSets[ssIndex].selectionQuantity,
			};
			for (let dIndex = 0; dIndex < set.subSets[ssIndex].dishes.length; dIndex++) {
				const dishData = {
					// if this is the first row for this subSet, add the subSet data
					// making the subSet data on the same line as the first dish data
					...(dIndex === 0 ? ssData : {}),
					dishes: set.subSets[ssIndex].dishes[dIndex].name,
					isAvailable: set.subSets[ssIndex].dishes[dIndex].isAvailable,
					category: set.subSets[ssIndex].dishes[dIndex].category,
					imgHref: set.subSets[ssIndex].dishes[dIndex].imgHref,
				};
				setsSheet.addRow(dishData);
			}
		}
	});
}
