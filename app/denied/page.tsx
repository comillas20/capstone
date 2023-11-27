import { Button } from "@components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DeniedPage() {
	return (
		<div className="flex h-screen flex-col items-center justify-center gap-4">
			<span>There is absolutely nothing here. Nope. Nothing.</span>
			<Button>
				<ArrowLeft className="mr-4" />
				<Link href={"/"}>Home</Link>
			</Button>
		</div>
	);
}
