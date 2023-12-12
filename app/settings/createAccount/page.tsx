import { Separator } from "@components/ui/separator";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import { CreateAccountForm } from "./CreateAccountForm";
import prisma from "@lib/db";

export default async function SettingsCreateAccountPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Administrator account creation</h3>
				<p className="text-sm text-muted-foreground">Create account for new</p>
			</div>
			<Separator />
			<CreateAccountForm />
		</div>
	);
}
