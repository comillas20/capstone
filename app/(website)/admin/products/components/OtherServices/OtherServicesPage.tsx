"use client";
import { DataTable } from "@app/(website)/admin/components/DataTable";
import { columns } from "./Columns";
import { DataTableToolbar } from "./DataTableToolbar";
import { useContext } from "react";
import {
	ProductPageContext,
	ProductPageContextProps,
} from "../ProductPageProvider";

export default function OtherServicesPage() {
	const { services } = useContext(ProductPageContext) as ProductPageContextProps;
	return (
		<div>
			<DataTable data={services} columns={columns} Toolbar={DataTableToolbar} />
		</div>
	);
}
