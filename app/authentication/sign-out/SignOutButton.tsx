"use client";

import { Button } from "@components/ui/button";
import { signOut } from "next-auth/react";

export default function SignOutButton({ className }: { className?: string }) {
	return (
		<Button
			className={className}
			onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
			variant="link">
			Sign out
		</Button>
	);
}
