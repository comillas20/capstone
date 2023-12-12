import { options } from "@app/api/auth/[...nextauth]/options";
import SignOutButton from "@app/api/auth/signOut/SignOutButton";
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
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function UserNav() {
	const session = await getServerSession(options);
	// session details is static(?), until user log outs
	const data =
		session &&
		session.user.userID &&
		session.user.provider === "CREDENTIALS" &&
		(await prisma.account.findUnique({
			where: {
				id: parseInt(session.user.userID),
			},
		}));
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size={"icon"} className="relative rounded-full">
					<Avatar className="flex h-full w-full items-center justify-center rounded-full bg-muted">
						{session &&
							(() => {
								if (data && data.image && session.user.provider === "CREDENTIALS") {
									return (
										<AvatarCloudinaryImage
											width={200}
											height={240}
											src={data.image}
											sizes="100vw"
											alt={data.name ?? "User image"}
											className="h-full w-full"
										/>
									);
								} else if (
									session.user.name &&
									session.user.image &&
									session.user.provider === "GOOGLE"
								) {
									return (
										<AvatarImage
											src={session.user.image}
											alt={session.user.name ?? "User image"}
										/>
									);
								}
							})()}
						{(!session || !session.user.image) && <UserCircle strokeWidth={1.5} />}
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{session ? session.user.name : "Guest"}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{session
								? !!session.user.email
									? session.user.email
									: session.user.phoneNumber
								: "Please sign in"}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
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
					{(() => {
						if (session && session.user.role === "ADMIN") {
							return (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/settings/snapshot" className="h-full w-full">
											Back up & Restore
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/settings/createAccount" className="h-full w-full">
											Create Admin Account
										</Link>
									</DropdownMenuItem>
								</>
							);
						}
					})()}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					{session ? (
						<SignOutButton className="flex h-full w-full justify-start p-0 hover:no-underline" />
					) : (
						<Link className="h-full w-full" href="/api/auth/signIn">
							Sign in
						</Link>
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
