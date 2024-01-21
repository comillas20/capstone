import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@components/ui/table";
import { ColumnDef, flexRender, Table as t } from "@tanstack/react-table";
import { Reservations } from "./Columns";
type ReservationTableProps = {
	table: t<Reservations>;
	columns: ColumnDef<Reservations, any>[];
};
export default function ReservationTable({
	table,
	columns,
}: ReservationTableProps) {
	return (
		<Table className="rounded-md border">
			<TableHeader>
				{table.getHeaderGroups().map(headerGroup => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map(header => {
							return (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							);
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map(row => {
						const status = row.original.status;
						let statusCSS: string;
						switch (status) {
							case "ONGOING":
								statusCSS = "bg-green-300/50";
								break;
							case "PENDING" || "PARTIAL":
								statusCSS = "bg-secondary";
								break;
							case "CANCELLED":
								statusCSS = "bg-destructive/20";
								break;
							default:
								statusCSS = "";
								break;
						}
						return (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								className={statusCSS}>
								{row.getVisibleCells().map(cell => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						);
					})
				) : (
					<TableRow>
						<TableCell colSpan={columns.length} className="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
