import { Separator } from "@components/ui/separator";
import { GeneralForm } from "./GeneralForm";
import prisma from "@lib/db";
import { getSettings } from "@app/(website)/serverActionsGlobal";

export default async function GeneralPage() {
	const settings = await getSettings();
	const s2 = settings
		? {
				...settings,
				maintainanceDates: settings.maintainanceDates.map(m => m.date),
		  }
		: null;
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">General</h3>
				<p className="text-sm text-muted-foreground">General setings</p>
			</div>
			<Separator />
			<GeneralForm settings={s2} />
		</div>
	);
}
