import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import Link from "next/link";
import brandLogo from "public/brand-16.svg";
export default function Brand() {
	return (
		<Link href="/" className="relative h-8 w-8 rounded-full bg-primary">
			<Avatar className="h-8 w-8">
				<AvatarImage src={brandLogo} alt="@jakelou" />
				<AvatarFallback>J</AvatarFallback>
			</Avatar>
		</Link>
	);
}
