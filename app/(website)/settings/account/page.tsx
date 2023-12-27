import { Separator } from "@components/ui/separator";
import { AccountForm } from "./AccountForm";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import prisma from "@lib/db";

export default async function SettingsAccountPage() {
	const session = await getServerSession(options);
	// session details is static(?), until user log outs
	const data =
		session && session.user.provider === "CREDENTIALS"
			? await prisma.account.findUnique({
					where: {
						id: parseInt(session.user.userID),
					},
			  })
			: undefined;
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Account</h3>
				<p className="text-sm text-muted-foreground">
					Update your account settings
				</p>
			</div>
			<Separator />
			{data && <AccountForm user={data} />}
		</div>
	);
}
