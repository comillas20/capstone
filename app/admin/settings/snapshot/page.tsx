"use client";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default async function BackUpRestorePage() {
	return (
		<div className="flex h-full flex-1 flex-col space-y-8">
			<Button
				onClick={async () => {
					// Create workbook and worksheet
					const workbook = new ExcelJS.Workbook();
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
					// Use FileSaver to save the Blob
					saveAs(blob, "filename.xlsx");
				}}>
				Download
			</Button>
		</div>
	);
}

// restore
// import ExcelJS from "exceljs";

// // This function will be triggered when a file is selected
// const onFileChange = async e => {
// 	const file = e.target.files[0];

// 	// Create a new workbook
// 	const workbook = new ExcelJS.Workbook();

// 	// Convert the file to an array buffer
// 	const arrayBuffer = await file.arrayBuffer();

// 	// Load the workbook from the array buffer
// 	await workbook.xlsx.load(arrayBuffer);

// 	// Get the first worksheet in the workbook
// 	const worksheet = workbook.getWorksheet(1);

// 	// Log the value of cell A1
// 	console.log(worksheet.getCell("A1").value);
// };

// // Render the file input element
// return <input type="file" onChange={onFileChange} />;
