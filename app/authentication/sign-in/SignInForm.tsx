"use client";
import { Button, buttonVariants } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { FacebookIcon, Loader2, MoveLeftIcon } from "lucide-react";
import * as z from "zod";
import { cn, isEmailValid, isPhoneNumberValid } from "@lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@components/ui/form";
import { useTransition } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInForm() {
	const signInSchema = z.object({
		emailOrPhoneNumber: z
			.string()
			.refine(eop => isEmailValid(eop) || isPhoneNumberValid(eop), {
				message: "Please input a valid email or mobile number",
			}),
		password: z.string().min(8, {
			message: "Password must have atleast 8 characters",
		}),
	});

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			emailOrPhoneNumber: "",
			password: "",
		},
	});

	const [isSubmitting, startSubmitting] = useTransition();
	const searchParams = useSearchParams();
	const onSubmit = (data: z.infer<typeof signInSchema>) => {
		startSubmitting(async () => {
			const signInData = await signIn("credentials", {
				emailOrPhoneNumber: data.emailOrPhoneNumber,
				password: data.password,
				redirect: true,
				callbackUrl: searchParams.get("callbackUrl") ?? "/",
			});
		});
	};
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
				href="/authentication/register"
				className={cn(
					buttonVariants({ variant: "ghost" }),
					"absolute right-4 top-4 md:right-8 md:top-8"
				)}>
				Register
			</Link>
			<div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Sign in with your account
					</h1>
					<p className="text-sm text-muted-foreground">
						Enter your email or phone number you used to register below to continue
					</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="emailOrPhoneNumber"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel>Email or mobile number</FormLabel>
										<FormControl>
											<Input type="text" placeholder="Email/Mobile number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" {...field} placeholder="Password" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-6">
								<Button
									variant="outline"
									type="button"
									onClick={async () => {
										const signInData = await signIn("facebook", {
											redirect: true,
											callbackUrl: searchParams.get("callbackUrl") ?? "/",
										});
									}}>
									<FacebookIcon className="mr-2 h-4 w-4" />
									Facebook
								</Button>
								<Button
									variant="outline"
									type="button"
									onClick={async () => {
										const signInData = await signIn("google", {
											redirect: true,
											callbackUrl: searchParams.get("callbackUrl") ?? "/",
										});
									}}>
									<svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
										<path
											fill="currentColor"
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
										/>
									</svg>
									Google
								</Button>
							</div>
						</div>
						<div className="flex flex-col gap-4">
							<div className="w-full space-y-2">
								<Button className="w-full" disabled={isSubmitting}>
									{isSubmitting && <Loader2 className="animate-spin" />}
									Sign in
								</Button>
								<p className="text-center text-sm font-medium text-destructive">
									{searchParams.get("error")}
								</p>
							</div>

							<div className="flex w-full justify-between">
								<Button
									variant={"link"}
									className="flex items-end justify-start p-0 text-xs text-accent-foreground">
									Forgot Password?
								</Button>
								<Link
									href="/authentication/register"
									className="flex items-end text-xs text-primary">
									Don't have an account?
								</Link>
							</div>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
