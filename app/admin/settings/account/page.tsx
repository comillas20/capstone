import { Separator } from "@components/ui/separator";
import { AccountForm } from "./AccountForm";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";

export default async function SettingsAccountPage() {
	const session = await getServerSession(options);
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Account</h3>
				<p className="text-sm text-muted-foreground">
					Update your account settings
				</p>
			</div>
			<Separator />
			{/* <AccountForm name={session.user.name} /> */}
		</div>
	);
}
