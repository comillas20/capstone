import { Separator } from "@components/ui/separator";
import { GeneralForm } from "./GeneralForm";

export default function GeneralPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">General</h3>
				<p className="text-sm text-muted-foreground">General setings</p>
			</div>
			<Separator />
			<GeneralForm />
		</div>
	);
}
