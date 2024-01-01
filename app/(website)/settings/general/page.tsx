import { Separator } from "@components/ui/separator";
import { GeneralForm } from "./GeneralForm";
import {
	getFAQ,
	getMaintainanceDates,
	getSettings,
} from "@app/(website)/serverActionsGlobal";

export default async function GeneralPage() {
	const settings = await getSettings();
	const maintainanceDates = await getMaintainanceDates();
	const faq = await getFAQ();
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">General</h3>
				<p className="text-sm text-muted-foreground">General setings</p>
			</div>
			<Separator />
			<GeneralForm
				settings={settings}
				maintainanceDates={maintainanceDates.map(item => item.date)}
				faq={faq}
			/>
		</div>
	);
}
