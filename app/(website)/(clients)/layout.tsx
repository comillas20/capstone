import { Button } from "@components/ui/button";
import { FacebookIcon } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-y-12">
			<div className="flex-1 space-y-4 px-32 py-4">{children}</div>
		</div>
	);
}
