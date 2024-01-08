import SignOutButton from "@app/authentication/sign-out/SignOutButton";
import {
	Avatar,
	AvatarCloudinaryImage,
	AvatarImage,
} from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import prisma from "@lib/db";
import { UserCircle } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import male_1 from "public/avatars/male-1.png";
import male_2 from "public/avatars/male-2.png";
import male_3 from "public/avatars/male-3.png";
import male_4 from "public/avatars/male-4.png";
import female_1 from "public/avatars/female-1.png";
import female_2 from "public/avatars/female-2.png";
import female_3 from "public/avatars/female-3.png";
import Image from "next/image";

export default async function UserNav({
	session,
	data,
}: {
	session: Session | null;
	data: {
		id: number;
		name: string;
		phoneNumber: string;
		image: string | null;
	} | null;
}) {
	const avatars = [
		{ name: "male-1", img: male_1 },
		{ name: "female-1", img: female_1 },
		{ name: "male-2", img: male_2 },
		{ name: "female-2", img: female_2 },
		{ name: "male-3", img: male_3 },
		{ name: "female-3", img: female_3 },
		{ name: "male-4", img: male_4 },
	];
	const src = avatars.find(avatar => avatar.name === data?.image);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size={"icon"} className="relative rounded-full">
					<Avatar className="flex h-full w-full items-center justify-center rounded-full bg-muted">
						{session && data && src ? (
							<Image
								width={200}
								height={240}
								src={src.img}
								sizes="100vw"
								alt={data.name ?? "User image"}
								className="h-full w-full"
							/>
						) : (
							<UserCircle strokeWidth={1.5} />
						)}
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{data ? data.name : "Guest"}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{data ? data.phoneNumber : "Please sign in"}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{(() => {
					if (session && session.user.role === "ADMIN") {
						return (
							<DropdownMenuGroup>
								<DropdownMenuItem asChild>
									<Link href="/settings/general" className="h-full w-full">
										General
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/settings/account" className="h-full w-full">
										Account
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/settings/snapshot" className="h-full w-full">
										Back up & Restore
									</Link>
								</DropdownMenuItem>
							</DropdownMenuGroup>
						);
					} else {
						return (
							<DropdownMenuGroup>
								<DropdownMenuItem asChild>
									<Link href="/settings/account" className="h-full w-full">
										Account
									</Link>
								</DropdownMenuItem>
							</DropdownMenuGroup>
						);
					}
				})()}
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					{session ? (
						<SignOutButton className="flex h-full w-full justify-start p-0 hover:no-underline" />
					) : (
						<Link className="h-full w-full" href="/authentication/sign-in">
							Sign in
						</Link>
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
