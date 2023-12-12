import { z } from "zod";

import { columns } from "./components/Columns";
import { DataTable } from "@app/(website)/admin/components/DataTable";
import { DataTableToolbar } from "./components/DataTableToolbar";
import dummyReservations from "./dummyData";
import { Calendar } from "@components/ui/calendar";
import AdminCalendar from "./components/AdminCalendar";

// Simulate a database read for tasks.
async function getTasks() {}

export default async function ReservationsPage() {
	return (
		<div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
					<p className="text-muted-foreground">
						Here&apos;s the current list of reservations!
					</p>
				</div>
			</div>
			<div className="flex gap-4">
				<AdminCalendar />
				<DataTable
					data={dummyReservations}
					columns={columns}
					Toolbar={DataTableToolbar}
				/>
			</div>
		</div>
	);
}

export enum status {
	true = "Accepted",
	false = "Pending",
}
