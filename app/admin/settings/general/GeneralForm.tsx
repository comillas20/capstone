"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { isEmailValid, isPhoneNumberValid } from "@lib/utils";
import { Button } from "@components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { toast } from "@components/ui/use-toast";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import AvatarPicker from "@components/AvatarPicker";

// type AccountFormProps = {
// 	user: {
// 		name?: string | null | undefined;
// 		email?: string | null | undefined;
// 		image?: string | null | undefined;
// 		phoneNumber?: string | null | undefined;
// 	};
// };

export function GeneralForm() {
	// const accountFormSchema = z.object();

	//type AccountFormValues = z.infer<typeof accountFormSchema>;

	// const form = useForm<AccountFormValues>({
	// 	resolver: zodResolver(accountFormSchema),
	// 	defaultValues: {},
	// });

	const [isSubmitting, startSubmitting] = useTransition();
	// function onSubmit(data: AccountFormValues) {
	// 	if (!data.email && !data.phone) {
	// 		setIsEmailPhoneBothEmpty(true);
	// 		return;
	// 	} else {
	// 		startSubmitting(async () => {
	// 			type AdminData = {
	// 				id: number;
	// 				name?: string;
	// 				image?: string;
	// 				email?: string;
	// 				phoneNumber?: string;
	// 				password?: string;
	// 			};
	// 			// Note to self: id apparently always undefined in session
	// 			// so I had to get the user's id via the user's name
	// 			if (!user.name) return;
	// 			const updateData: AdminData = {
	// 				id: await getAccountID(user.name),
	// 				name: data.name,
	// 				image: data.image,
	// 				email: data.email,
	// 				phoneNumber: data.phone,
	// 				password: data.password,
	// 			};
	// 			console.log(updateData.id);
	// 			const admin = await editAdminAccount(updateData);

	// 			if (admin) {
	// 				toast({
	// 					title: "Success",
	// 					description: "Changes are saved successfully.",
	// 					duration: 5000,
	// 				});
	// 			} else {
	// 				toast({
	// 					variant: "destructive",
	// 					title: "Failed",
	// 					description: "Changed failed to save.",
	// 					duration: 5000,
	// 				});
	// 			}
	// 			form.reset();
	// 		});
	// 	}
	// }

	return (
		// <Form {...form}>
		// 	<form
		// 		onSubmit={form.handleSubmit(onSubmit)}
		// 		className="space-y-8"
		// 		encType="multipart/form-data">
		// 		<FormField
		// 			control={form.control}
		// 			name="name"
		// 			render={({ field }) => (
		// 				<FormItem>
		// 					<FormLabel>Name</FormLabel>
		// 					<FormControl>
		// 						<Input placeholder="Your name" {...field} />
		// 					</FormControl>
		// 					<FormMessage />
		// 				</FormItem>
		// 			)}
		// 		/>
		// 		<FormField
		// 			control={form.control}
		// 			name="image"
		// 			render={({ field }) => (
		// 				<FormItem>
		// 					<FormLabel>Profile Image</FormLabel>
		// 					<FormControl>
		// 						<AvatarPicker value={field.value} onValueChange={field.onChange}>
		// 							<Button className="block" variant={"outline"}>
		// 								Select an image
		// 							</Button>
		// 						</AvatarPicker>
		// 					</FormControl>
		// 					<FormMessage />
		// 				</FormItem>
		// 			)}
		// 		/>
		// 		<div className="grid grid-cols-2 gap-4">
		// 			<FormField
		// 				control={form.control}
		// 				name="email"
		// 				render={({ field }) => (
		// 					<FormItem>
		// 						<FormLabel>Email</FormLabel>
		// 						<FormControl>
		// 							<Input
		// 								type="email"
		// 								placeholder="Email"
		// 								{...field}
		// 								onChange={e => {
		// 									field.onChange(e);
		// 									setIsEmailPhoneBothEmpty(false);
		// 								}}
		// 							/>
		// 						</FormControl>
		// 						<FormMessage />
		// 					</FormItem>
		// 				)}
		// 			/>
		// 			<FormField
		// 				control={form.control}
		// 				name="phone"
		// 				render={({ field }) => (
		// 					<FormItem>
		// 						<FormLabel>Phone Number</FormLabel>
		// 						<FormControl>
		// 							<Input
		// 								placeholder="Phone number"
		// 								{...field}
		// 								onChange={e => {
		// 									field.onChange(e);
		// 									setIsEmailPhoneBothEmpty(false);
		// 								}}
		// 							/>
		// 						</FormControl>
		// 						<FormMessage />
		// 					</FormItem>
		// 				)}
		// 			/>
		// 			{isEmailPhoneBothEmpty && (
		// 				<p className="col-span-2 text-sm font-medium text-destructive">
		// 					Email and phone number cannot be both empty
		// 				</p>
		// 			)}
		// 		</div>
		// 		<FormField
		// 			control={form.control}
		// 			name="password"
		// 			render={({ field }) => (
		// 				<FormItem>
		// 					<FormLabel>Password</FormLabel>
		// 					<FormControl>
		// 						<Input type="password" placeholder="New Password" {...field} />
		// 					</FormControl>
		// 					<FormMessage />
		// 				</FormItem>
		// 			)}
		// 		/>
		// 		<FormField
		// 			control={form.control}
		// 			name="confirmPassword"
		// 			render={({ field }) => (
		// 				<FormItem>
		// 					<FormLabel>Confirm Password</FormLabel>
		// 					<FormControl>
		// 						<Input type="password" placeholder="New Password" {...field} />
		// 					</FormControl>
		// 					<FormMessage />
		// 				</FormItem>
		// 			)}
		// 		/>
		// 		<Button type="submit" disabled={isSubmitting}>
		// 			{isSubmitting && <Loader2 className="mr-2 animate-spin" />}
		// 			Save Changes
		// 		</Button>
		// 	</form>
		// </Form>
		<div></div>
	);
}