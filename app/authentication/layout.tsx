import { getServerSession } from "next-auth";
import { options } from "@api/auth/[...nextauth]/options";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import JakelouLogo from "@components/JakelouLogo";

export default async function SignInPage({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(options);
	return session && session.user.id ? (
		<div className="flex h-screen flex-col items-center justify-center gap-4">
			<span>You are already signed in. No need to repeat things.</span>
			<Button>
				<ArrowLeft className="mr-4" />
				<Link href={"/"}>Home</Link>
			</Button>
		</div>
	) : (
		<div className="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
				<div className="absolute inset-0 bg-zinc-900" />
				<div className="relative z-20 flex items-center text-lg font-medium">
					<JakelouLogo className="mr-2 h-8 w-8" />
					Jakelou
				</div>
				{/* <div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">
							&ldquo;This library has saved me countless hours of work and helped me
							deliver stunning designs to my clients faster than ever before.&rdquo;
						</p>
						<footer className="text-sm">Sofia Davis</footer>
					</blockquote>
				</div> */}
			</div>
			<div className="relative flex h-full items-center justify-center lg:p-8">
				{children}
			</div>
		</div>
	);
}
