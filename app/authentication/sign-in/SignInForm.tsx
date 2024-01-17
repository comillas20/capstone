"use client";
import { Button, buttonVariants } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Loader2, MoveLeftIcon } from "lucide-react";
import * as z from "zod";
import { cn, convertPhoneNumber, isPhoneNumberValid } from "@lib/utils";
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
import { useEffect, useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { sendSMSCode, validateCredentials } from "./serverActions";

type UserData = {
	result: string;
	phoneNumber: string;
};
export default function SignInForm() {
	const [time, setTime] = useState(120);
	const [isTimerStarted, setIsTimerStarted] = useState(false);
	const [initialData, setInitialData] = useState<UserData | null>(null);
	useEffect(() => {
		if (isTimerStarted) {
			// Update the time every second
			const timerID = setInterval(() => {
				setTime(prevTime => {
					if (prevTime <= 1) {
						// Stop the timer
						setIsTimerStarted(false);
						return 0;
					} else {
						return prevTime - 1;
					}
				});
			}, 1000);

			// Clear interval on re-render to avoid memory leaks
			return () => clearInterval(timerID);
		}
	}, [isTimerStarted]);

	// Convert time to mm:ss format
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;
	const signInSchema = z.object({
		phoneNumber: z.string().refine(value => isPhoneNumberValid(value), {
			message: "Please input a valid mobile number",
		}),
		password: z.string().min(8, {
			message: "Password must have atleast 8 characters",
		}),
		code: z
			.string()
			.optional()
			.refine(value => !value || value.length === 6), // value must be either empty or has 6 char
	});

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			phoneNumber: "",
			password: "",
			code: "",
		},
	});

	const [isSubmitting, startSubmitting] = useTransition();
	const searchParams = useSearchParams();
	const [message, setMessage] = useState<string>();
	const onSubmit = (values: z.infer<typeof signInSchema>) => {
		startSubmitting(async () => {
			const data = await validateCredentials({
				phoneNumber: convertPhoneNumber(values.phoneNumber),
				password: values.password,
				code: values.code,
			});
			if (data?.result === "code_verified") {
				const signInData = await signIn("credentials", {
					phoneNumber: convertPhoneNumber(values.phoneNumber),
					password: values.password,
					redirect: true,
					callbackUrl: searchParams.get("callbackUrl") ?? "/",
				});
			} else if (data?.result === "code_expired") {
				setInitialData(data);
				setMessage(
					"Code expired, we sent a new one in the provided mobile number. Please check messages"
				);
			} else if (data?.result === "new_code") {
				setInitialData(data);
				setMessage(
					"We sent a code in the provided mobile number. Please check messages"
				);
			} else if (data?.result === "wrong_code") {
				setMessage("Invalid code");
			} else {
				setMessage("Incorrect mobile number and/or password");
			}
			// if initialData exists but code is not provided again, do nothing
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
						Enter your phone number you used to register below to continue
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
							{initialData && initialData.phoneNumber && (
								<FormField
									control={form.control}
									name="code"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Code</FormLabel>
											<FormControl>
												<Input type="text" {...field} />
											</FormControl>
											<div className="flex items-center justify-end gap-2">
												<Button
													type="button"
													variant="link"
													disabled={isTimerStarted}
													onClick={async () => {
														const result = await sendSMSCode(
															initialData.phoneNumber as string
														);
														if (result) {
															// because result is in milliseconds
															setTime(result / 1000);
															setIsTimerStarted(true);
														}
													}}>
													Resend
												</Button>
												{isTimerStarted && (
													<p>
														{`${minutes.toString().padStart(2, "0")}:${seconds
															.toString()
															.padStart(2, "0")}`}
													</p>
												)}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>
						<div className="flex flex-col gap-4">
							<div className="w-full space-y-2">
								<Button type="submit" className="w-full" disabled={isSubmitting}>
									{isSubmitting && <Loader2 className="animate-spin" />}
									Sign in
								</Button>
								{!message && (
									<p className="text-center text-sm font-medium text-destructive">
										{searchParams.get("error")}
									</p>
								)}
								{message && (
									<p className="text-center text-sm font-medium">{message}</p>
								)}
							</div>

							<div className="flex w-full justify-between">
								{/* <Button
									variant={"link"}
									className="flex items-end justify-start p-0 text-xs text-accent-foreground">
									Forgot Password?
								</Button> */}
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
