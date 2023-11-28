import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { getCldImageUrl } from "next-cloudinary";
import Link from "next/link";
export default function Brand() {
	const logo = getCldImageUrl({
		src: "icons/i3mc6fegkgbkq899fg4d",
		width: 16,
		height: 16,
	});
	return (
		<Link href="/" className="relative flex h-8 items-center">
			<Avatar className="h-8 w-8 bg-primary">
				<AvatarImage src={logo} alt="@jakelou" />
				<AvatarFallback>J</AvatarFallback>
			</Avatar>
			<span className="ml-2 mr-4">Jakelou</span>
		</Link>
	);
}
