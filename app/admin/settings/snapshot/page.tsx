import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import ExcelJS from "exceljs";
import RestoreBackUpForm from "./RestoreBackupForm";
import DownloadBackUp from "./DownloadBackUp";
import prisma from "@lib/db";

export default async function BackUpRestorePage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Backup & Restore</h3>
				<p className="text-sm text-muted-foreground">Back up and restore data</p>
			</div>
			<Separator />
			<RestoreBackUpForm />
			<DownloadBackUp />
		</div>
	);
}

async function restoreBackUp(file: File) {
	// Create a new workbook
	const workbook = new ExcelJS.Workbook();
	// Convert the file to an array buffer
	const arrayBuffer = await file.arrayBuffer();
	// Load the workbook from the array buffer
	await workbook.xlsx.load(arrayBuffer);
	// Get the first worksheet in the workbook
	const worksheet = workbook.getWorksheet(1);

	if (!worksheet) return;
	// Log the value of cell A1
	// console.log(worksheet.getCell("A1").value);
	worksheet.getCell("id");
}

export enum WorksheetNames {
	DCC = "Products-Dishes",
	Set = "Sets",
}

export type DCC = {
	name: string;
	createdAt: Date;
	isAvailable: boolean;
	category: string;
	course: string;
};

export type Set = {
	name: string;
	createdAt: Date;
	minimumPerHead: number;
	price: number;
	subSets: {
		course: string;
		dishes: string[];
		name: string;
		selectionQuantity: number;
	}[];
};
