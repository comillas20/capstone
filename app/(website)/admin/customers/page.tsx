import { Separator } from "@components/ui/separator";
import { DataTable } from "@admin/components/DataTable";
import { columns } from "./components/Columns";
import DataTableToolbar from "./components/DataTableToolbar";
import prisma from "@lib/db";

export default async function Customers() {
	const userAccounts = await prisma.account.findMany({
		select: {
			name: true,
			phoneNumber: true,
			createdAt: true,
		},
		where: { role: "USER" },
	});
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Customers</h2>
					<p className="text-muted-foreground">
						Verify, refund, and accept payments
					</p>
				</div>
			</div>
			<Separator />
			<DataTable
				columns={columns}
				data={userAccounts}
				Toolbar={DataTableToolbar}
			/>
		</div>
	);
}
