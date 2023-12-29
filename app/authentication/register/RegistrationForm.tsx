"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn, isEmailValid, isPhoneNumberValid } from "@lib/utils";
import { Button, buttonVariants } from "@components/ui/button";
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
import { useTransition } from "react";
import {
	createNewAccount,
	doesNameExists,
	doesPhoneNumberExists,
} from "./serverActions";
import { Loader2, MoveLeftIcon } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function RegistrationForm() {
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
			phone: z.string().superRefine(async (phone, ctx) => {
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
			phone: "",
			password: "",
			confirmPassword: "",
		},
	});

	const searchParams = useSearchParams();
	function onSubmit(data: CreateAccountFormValues) {
		startCreating(async () => {
			type UserData = {
				name: string;
				phoneNumber: string;
				password: string;
				role: "ADMIN" | "USER";
			};
			const newData: UserData = {
				name: data.name,
				phoneNumber: data.phone,
				password: data.password,
				role: "USER",
			};
			const newUser = await createNewAccount(newData);
			if (newUser) {
				const signInData = await signIn("credentials", {
					phoneNumber: newUser.phoneNumber,
					password: data.password,
					redirect: true,
					callbackUrl: searchParams.get("callbackUrl") ?? "/",
				});
				form.reset(); // in case the user isnt redirected to home yet
			}
		});
	}
	const router = useRouter();
	return (
		<>
			<Button
				className="absolute left-4 top-4 md:left-8 md:top-8"
				variant="ghost"
				onClick={() => router.back()}>
				<MoveLeftIcon className="mr-2" /> Back
			</Button>
			<Link
				href="/authentication/sign-in"
				className={cn(
					buttonVariants({ variant: "ghost" }),
					"absolute right-4 top-4 md:right-8 md:top-8"
				)}>
				Sign-in
			</Link>
			<div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px] lg:w-[450px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Create an account
					</h1>
					<p className="text-sm text-muted-foreground">
						Enter your email below to create your account
					</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="flex flex-col space-y-8">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder="Your name" {...field} />
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
						</div>
						<div className="flex flex-col gap-4">
							<Button type="submit" disabled={isCreating}>
								{isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Create account
							</Button>
							<Link
								href="/authentication/sign-in"
								className="flex items-end self-center text-xs text-primary hover:underline">
								Already have an account?
							</Link>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
