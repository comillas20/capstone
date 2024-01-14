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
			<div className="space-y-2">
				<p className="text-sm font-medium">Back up files</p>
				<DownloadBackUp />
			</div>
		</div>
	);
}
