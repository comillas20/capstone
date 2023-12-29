import { Separator } from "@components/ui/separator";
import RestoreBackUpForm from "./RestoreBackupForm";
import DownloadBackUp from "./DownloadBackUp";

export default async function BackUpRestorePage() {
	return (
		<div className="max-w-2xl space-y-6">
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
	imgHref: string | null;
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
