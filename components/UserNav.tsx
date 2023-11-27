import { options } from "@app/api/auth/[...nextauth]/options";
import SignOutButton from "@app/api/auth/signOut/SignOutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function UserNav() {
	const session = await getServerSession(options);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="h-8 w-8">
						{session && session.user.image && (
							<AvatarImage src={session.user.image} alt="@shadcn" />
						)}
						<AvatarFallback>
							<UserCircle strokeWidth={1.5} />
						</AvatarFallback>
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
					<DropdownMenuItem>
						<Link href="/admin/settings/account" className="h-full w-full">
							Profile
						</Link>
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
					{/* <DropdownMenuItem>
						Billing
						<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
					</DropdownMenuItem> */}
					<DropdownMenuItem>
						Settings
						<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					{session ? (
						<SignOutButton className="flex h-full w-full justify-start p-0" />
					) : (
						<Link className="h-full w-full" href="/api/auth/signIn">
							Sign in
						</Link>
					)}
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
