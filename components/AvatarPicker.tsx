"use client";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import React from "react";
import { AVATAR_IMAGE_FOLDER, cn } from "@lib/utils";
import Image from "next/image";
import male_1 from "public/avatars/male-1.png";
import male_2 from "public/avatars/male-2.png";
import male_3 from "public/avatars/male-3.png";
import male_4 from "public/avatars/male-4.png";
import female_1 from "public/avatars/female-1.png";
import female_2 from "public/avatars/female-2.png";
import female_3 from "public/avatars/female-3.png";

const DropdownMenuRadioItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<DropdownMenuPrimitive.RadioItem
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center rounded-sm text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}>
		{children}
	</DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
type AvatarPicker = { children: React.ReactNode } & React.ComponentProps<
	typeof DropdownMenuRadioGroup
>;
export default function AvatarPicker({
	children,
	value,
	onValueChange,
	...props
}: AvatarPicker) {
	const avatars = [
		{ name: "male-1", img: male_1 },
		{ name: "female-1", img: female_1 },
		{ name: "male-2", img: male_2 },
		{ name: "female-2", img: female_2 },
		{ name: "male-3", img: male_3 },
		{ name: "female-3", img: female_3 },
		{ name: "male-4", img: male_4 },
	];
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={onValueChange}
					className={cn("grid grid-cols-4 gap-4 p-4", props.className)}
					{...props}>
					{avatars.map(avatar => (
						<DropdownMenuRadioItem
							key={avatar.name}
							value={avatar.name}
							className="h-12 w-12 rounded-full p-1 data-[state=checked]:border-2 data-[state=checked]:border-primary">
							<Image
								width="200"
								height="240"
								src={avatar.img}
								sizes="100vw"
								alt={avatar.name}
								loading="lazy"
								blurDataURL="data:image/jpeg..."
								className="h-full w-full"
							/>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
