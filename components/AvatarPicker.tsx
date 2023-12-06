"use client";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import React, { useState } from "react";
import { cn } from "@lib/utils";
import { CldImage } from "next-cloudinary";

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
		"male-1",
		"female-1",
		"male-2",
		"female-2",
		"male-3",
		"female-3",
		"male-4",
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
							key={avatar}
							value={avatar}
							className="h-12 w-12 rounded-full p-1 data-[state=checked]:border-2 data-[state=checked]:border-primary">
							<CldImage
								width="200"
								height="240"
								src={"profile_images/" + avatar}
								sizes="100vw"
								alt={avatar}
								className="h-full w-full"
							/>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
