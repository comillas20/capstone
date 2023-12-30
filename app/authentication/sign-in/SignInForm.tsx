"use client";
import { Button, buttonVariants } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Loader2, MoveLeftIcon } from "lucide-react";
import * as z from "zod";
import { cn, isPhoneNumberValid } from "@lib/utils";
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
		phoneNumber: z.string().refine(eop => isPhoneNumberValid(eop), {
			message: "Please input a valid mobile number",
		}),
		password: z.string().min(8, {
			message: "Password must have atleast 8 characters",
		}),
	});

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			phoneNumber: "",
			password: "",
		},
	});

	const [isSubmitting, startSubmitting] = useTransition();
	const searchParams = useSearchParams();
	const onSubmit = (data: z.infer<typeof signInSchema>) => {
		startSubmitting(async () => {
			const signInData = await signIn("credentials", {
				phoneNumber: data.phoneNumber,
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
								name="phoneNumber"
								render={({ field }) => (
									<FormItem className="grid gap-2">
										<FormLabel>Mobile number</FormLabel>
										<FormControl>
											<Input type="text" placeholder="Mobile number" {...field} />
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
									Don&apos;t have an account?
								</Link>
							</div>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
