import { options } from "@app/api/auth/[...nextauth]/options";
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

export default async function UserNav({
	session,
}: {
	session: Session | null;
}) {
	// session details is static(?), until user log outs
	const data =
		session &&
		(await prisma.account.findUnique({
			where: {
				id: session.user.id,
			},
		}));
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size={"icon"} className="relative rounded-full">
					<Avatar className="flex h-full w-full items-center justify-center rounded-full bg-muted">
						{session && data?.image ? (
							<AvatarCloudinaryImage
								width={200}
								height={240}
								src={data.image}
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
								{/* <DropdownMenuItem asChild>
										<Link href="/settings/createAccount" className="h-full w-full">
											Create Admin Account
										</Link>
									</DropdownMenuItem> */}
							</DropdownMenuGroup>
						);
					} else {
						return (
							<DropdownMenuGroup>
								{/* <DropdownMenuItem asChild>
									<Link href="/settings/general" className="h-full w-full">
										General
									</Link>
								</DropdownMenuItem> */}
								<DropdownMenuItem asChild>
									<Link href="/settings/account" className="h-full w-full">
										Account
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/settings/reservations" className="h-full w-full">
										Reservations
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
