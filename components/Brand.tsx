import Link from "next/link";
import JakelouLogo from "./JakelouLogo";
export default function Brand() {
	return (
		<Link href="/" className="relative flex h-8 items-center">
			<div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-primary">
				<span className="aspect-square h-full w-full">
					<JakelouLogo />
				</span>
			</div>
			<span className="ml-2 mr-4">Jakelou</span>
		</Link>
	);
}
