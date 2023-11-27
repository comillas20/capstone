"use client";

import { Button } from "@components/ui/button";
import { signOut } from "next-auth/react";

export default function SignOutButton({ className }: { className?: string }) {
	return (
		<Button className={className} onClick={() => signOut()} variant={"link"}>
			Sign out
		</Button>
	);
}
