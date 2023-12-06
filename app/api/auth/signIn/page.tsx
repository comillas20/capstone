import { getServerSession } from "next-auth";
import SignInForm from "./SignInForm";
import { options } from "../[...nextauth]/options";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@components/ui/button";

export default async function SignInPage() {
	const session = await getServerSession(options);
	return session && session.user.name ? (
		<div className="flex h-screen flex-col items-center justify-center gap-4">
			<span>You are already signed in. No need to repeat things.</span>
			<Button>
				<ArrowLeft className="mr-4" />
				<Link href={"/"}>Home</Link>
			</Button>
		</div>
	) : (
		<SignInForm />
	);
}
