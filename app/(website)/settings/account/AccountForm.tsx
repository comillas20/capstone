"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
	AVATAR_IMAGE_FOLDER,
	isEmailValid,
	isPhoneNumberValid,
} from "@lib/utils";
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
import { useTransition } from "react";
import {
	doesNameExists,
	doesPhoneNumberExists,
	editUserAccount,
} from "./serverActions";
import { Loader2 } from "lucide-react";
import AvatarPicker from "@components/AvatarPicker";

type AccountFormProps = {
	user: {
		id: number;
		name: string;
		image: string | null;
		phoneNumber: string;
	};
};

export function AccountForm({ user }: AccountFormProps) {
	const accountFormSchema = z
		.object({
			id: z.number(),
			name: z
				.string()
				.min(2, {
					message: "Name must be at least 2 characters.",
				})
				.refine(async name => name === user.name || !(await doesNameExists(name)), {
					message: "Name already exists",
				}),
			image: z.string().nullable(),
			phone: z.string().superRefine(async (phone, ctx) => {
				if (!isPhoneNumberValid(phone)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Please provide a valid phone number",
						fatal: true,
					});
					return z.NEVER;
				}

				if (phone !== user.phoneNumber && (await doesPhoneNumberExists(phone))) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Phone number already exists",
					});
				}

				return phone;
			}),
			password: z
				.string()
				// either value is empty (no modification) or value have more than or equal 8 characters (modifying)
				.refine(value => value.length === 0 || value.length >= 8, {
					message: "Password must have atleast 8 characters",
				})
				.optional(),
			confirmPassword: z.string().optional(),
		})
		.refine(data => data.password === data.confirmPassword, {
			message: "Passwords don't match",
			path: ["confirmPassword"], // path of error
		});

	type AccountFormValues = z.infer<typeof accountFormSchema>;

	const form = useForm<AccountFormValues>({
		resolver: zodResolver(accountFormSchema),
		defaultValues: {
			id: user.id,
			name: user.name,
			image: user.image?.replace(AVATAR_IMAGE_FOLDER, ""),
			phone: user.phoneNumber,
			password: "",
			confirmPassword: "",
		},
	});

	const [isSubmitting, startSubmitting] = useTransition();
	function onSubmit(data: AccountFormValues) {
		startSubmitting(async () => {
			type UserData = {
				id: number;
				name: string;
				image: string | null;
				phoneNumber: string;
				password?: string;
			};
			const updateData: UserData = {
				id: data.id,
				name: data.name,
				image: data.image,
				phoneNumber: data.phone,
				password: data.password,
			};
			const userData = await editUserAccount(updateData);

			if (userData) {
				toast({
					title: "Success",
					description: "Changes are saved successfully.",
					duration: 5000,
				});
			} else {
				toast({
					variant: "destructive",
					title: "Failed",
					description: "Changes failed to save.",
					duration: 5000,
				});
			}
			form.reset();
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8"
				encType="multipart/form-data">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Your name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Profile Image</FormLabel>
							<FormControl>
								<AvatarPicker
									value={field.value ?? undefined}
									onValueChange={field.onChange}>
									<Button className="block" variant={"outline"}>
										Choose an avatar
									</Button>
								</AvatarPicker>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone Number</FormLabel>
							<FormControl>
								<Input placeholder="Phone number" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="New Password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="New Password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end pt-8">
					<Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
						{isSubmitting && <Loader2 className="mr-2 animate-spin" />}
						Save Changes
					</Button>
				</div>
			</form>
		</Form>
	);
}
