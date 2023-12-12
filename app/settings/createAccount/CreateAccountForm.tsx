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
import prisma from "@lib/db";
import {
	createNewAdmin,
	doesEmailExists,
	doesNameExists,
	doesPhoneNumberExists,
} from "./serverActions";
import { Loader2 } from "lucide-react";

export function CreateAccountForm() {
	const [isEmailPhoneBothEmpty, setIsEmailPhoneBothEmpty] = useState(false);
	const [isCreating, startCreating] = useTransition();

	const accountFormSchema = z
		.object({
			name: z
				.string()
				.min(2, {
					message: "Name must be at least 2 characters.",
				})
				.refine(async name => !(await doesNameExists(name)), {
					message: "Name already exists",
				}),
			email: z
				.string()
				.optional()
				.superRefine(async (email, ctx) => {
					if (!email) {
						return email; // Return early if email is empty
					}

					if (!isEmailValid(email)) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Please provide a valid email",
							fatal: true,
						});
						return z.NEVER;
					}

					if (await doesEmailExists(email)) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Email already exists",
						});
					}

					return email;
				}),
			phone: z
				.string()
				.optional()
				.superRefine(async (phone, ctx) => {
					if (!phone) {
						return phone; // Return early if email is empty
					}

					if (!isPhoneNumberValid(phone)) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Please provide a valid phone number",
							fatal: true,
						});
						return z.NEVER;
					}

					if (await doesPhoneNumberExists(phone)) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Phone number already exists",
						});
					}

					return phone;
				}),
			password: z.string().min(8, {
				message: "Password must have atleast 8 characters",
			}),
			confirmPassword: z.string(),
		})
		.refine(data => data.password === data.confirmPassword, {
			message: "Passwords don't match",
			path: ["confirmPassword"], // path of error
		});

	type CreateAccountFormValues = z.infer<typeof accountFormSchema>;

	const form = useForm<CreateAccountFormValues>({
		resolver: zodResolver(accountFormSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(data: CreateAccountFormValues) {
		if (!data.email && !data.phone) {
			setIsEmailPhoneBothEmpty(true);
			return;
		} else {
			startCreating(async () => {
				type AdminData = {
					name: string;
					email?: string;
					phoneNumber?: string;
					password: string;
					role: "ADMIN" | "USER";
				};
				const newData: AdminData = {
					name: data.name,
					email: data.email,
					phoneNumber: data.phone,
					password: data.password,
					role: "ADMIN",
				};
				const newAdmin = await createNewAdmin(newData);

				if (newAdmin) {
					toast({
						title: "Success",
						description: "New Administrator has been created!",
						duration: 5000,
					});
				} else {
					toast({
						variant: "destructive",
						title: "Failed",
						description: "Creation of the new Administrator failed!",
						duration: 5000,
					});
				}
				form.reset();
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="Email"
										{...field}
										onChange={e => {
											field.onChange(e);
											setIsEmailPhoneBothEmpty(false);
										}}
									/>
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
									<Input
										placeholder="Phone number"
										{...field}
										onChange={e => {
											field.onChange(e);
											setIsEmailPhoneBothEmpty(false);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{isEmailPhoneBothEmpty && (
						<p className="col-span-2 text-sm font-medium text-destructive">
							Email and phone number cannot be both empty
						</p>
					)}
				</div>
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
				<Button type="submit" disabled={isCreating}>
					{isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Create account
				</Button>
			</form>
		</Form>
	);
}
