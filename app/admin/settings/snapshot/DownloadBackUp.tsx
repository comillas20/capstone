"use client";
import { Button } from "@components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "@components/ui/dialog";
import { Separator } from "@components/ui/separator";
import { Dialog } from "@radix-ui/react-dialog";
import saveAs from "file-saver";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import ExcelJS from "exceljs";
import { Form, FormControl, FormField, FormItem } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckboxWithText } from "@components/CheckboxWithText";

const optionsSchema = z.object({
	dishCatCourses: z.boolean(),
	sets: z.boolean(),
	transactions: z.boolean(),
	reports: z.boolean(),
});
type Options = z.infer<typeof optionsSchema>;
type DownloadBackUpProps = {
	dishes: () => Promise<
		{
			name: string;
			createdAt: Date;
			updatedAt: Date;
			isAvailable: boolean;
			price: number;
			category: {
				name: string;
			};
			course: {
				name: string;
			};
		}[]
	>;
};
export default function DownloadBackUp({ dishes }: DownloadBackUpProps) {
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
	function onSubmit(options: Options) {
		const { dishCatCourses, sets, reports, transactions } = options;
		startDownload(async () => {
			const blob = await createExcel(options);
			saveAs(blob, "jakelou.xlsx");
		});
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Back up files</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="space-y-2">
					<h4 className="font-medium leading-none">Back up files</h4>
					<p className="text-sm text-muted-foreground">Some description</p>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="dishCatCourses"
							render={({ field }) => (
								<>
									<FormItem>
										<FormControl>
											<CheckboxWithText
												onCheckedChange={field.onChange}
												checked={field.value}>
												Products/Dishes, Categories, and Courses
											</CheckboxWithText>
										</FormControl>
									</FormItem>
									<FormItem>
										<FormField
											control={form.control}
											name="sets"
											render={child => (
												<FormControl>
													<CheckboxWithText
														onCheckedChange={child.field.onChange}
														checked={field.value && child.field.value}
														disabled={!field.value}>
														Sets
													</CheckboxWithText>
												</FormControl>
											)}
										/>
									</FormItem>
								</>
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
						<DialogFooter className="flex justify-end">
							<Button variant={"ghost"}>Cancel</Button>
							<Button type="submit" disabled={isDownloading}>
								{isDownloading && <Loader2 className="mr-2 animate-spin" />}Download
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

async function createExcel(options: Options) {
	// Create workbook and worksheet
	const workbook = new ExcelJS.Workbook();
	if (options.dishCatCourses) {
		const dishesSheet = workbook.addWorksheet("Products/Dishes");
		dishesSheet.columns = [
			{ header: "Name", key: "Name", width: 20 },
			{ header: "Date Created", key: "created", width: 20 },
			{ header: "Date Updated", key: "updated", width: 20 },
			{ header: "Availability", key: "isAvailable", width: 10 },
			{ header: "Price/Pack", key: "price", width: 10 },
			{ header: "Category", key: "category", width: 20 },
			{ header: "Course", key: "course", width: 20 },
		];
	}

	const worksheet = workbook.addWorksheet("My Sheet");

	// Define columns
	worksheet.columns = [
		{ header: "Id", key: "id", width: 10 },
		{ header: "Name", key: "name", width: 32 },
		{ header: "D.O.B.", key: "DOB", width: 10 },
	];

	// Add rows
	worksheet.addRow({ id: 1, name: "John Doe", dob: new Date(1970, 1, 1) });
	worksheet.addRow({ id: 2, name: "Jane Doe", dob: new Date(1965, 1, 7) });

	// Write the Excel file to a buffer
	const buffer = await workbook.xlsx.writeBuffer();

	// Create a Blob from the Buffer
	const blob = new Blob([buffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
	return blob;
}