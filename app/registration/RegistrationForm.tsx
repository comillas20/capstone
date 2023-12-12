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
import {
	createNewAccount,
	doesEmailExists,
	doesNameExists,
	doesPhoneNumberExists,
} from "./serverActions";
import { Loader2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@components/ui/card";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function RegistrationForm() {
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
			email: undefined,
			phone: undefined,
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
				type UserData = {
					name: string;
					email?: string;
					phoneNumber?: string;
					password: string;
					role: "ADMIN" | "USER";
				};
				const newData: UserData = {
					name: data.name,
					email: data.email,
					phoneNumber: data.phone,
					password: data.password,
					role: "USER",
				};
				const newUser = await createNewAccount(newData);
				if (newUser) {
					const signInData = await signIn("credentials", {
						emailOrPhoneNumber: newUser.email ?? newUser.phoneNumber,
						password: newUser.password,
						redirect: true,
						callbackUrl: "/products",
					});
					form.reset(); // in case the user isnt redirected to home yet
				}
			});
		}
	}

	return (
		<Form {...form}>
			<Card className="w-96 border-primary">
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl">Sign up</CardTitle>
						<CardDescription>Create an account</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col space-y-8">
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
					</CardContent>
					<CardFooter className="flex flex-col gap-4">
						<Button type="submit" disabled={isCreating}>
							{isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Create account
						</Button>
						<Link
							href={"/api/auth/signIn"}
							className="flex items-end text-xs text-primary hover:underline">
							Already have an account?
						</Link>
					</CardFooter>
				</form>
			</Card>
		</Form>
	);
}
