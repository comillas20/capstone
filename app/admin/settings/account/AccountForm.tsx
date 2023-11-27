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
import { useState } from "react";

const accountFormSchema = z
	.object({
		name: z.string().min(2, {
			message: "Name must be at least 2 characters.",
		}),
		email: z
			.string()
			.optional()
			.refine(email => (email ? isEmailValid(email) : true), {
				message: "Please provide a valid email",
			}),
		phone: z
			.string()
			.optional()
			.refine(phone => (phone ? isPhoneNumberValid(phone) : true), {
				message: "Please provide a valid phone number",
			}),
		password: z.string().refine(pass => pass.length >= 8, {
			message: "Password must have atleast 8 characters",
		}),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"], // path of error
	});

type AccountFormValues = z.infer<typeof accountFormSchema>;
type AccountFormProps = {
	name: string;
};

export function AccountForm({ name }: AccountFormProps) {
	const [isEmailPhoneBothEmpty, setIsEmailPhoneBothEmpty] = useState(false);
	const defaultValues: Partial<AccountFormValues> = {
		name: name ? name : "",
	};
	const form = useForm<AccountFormValues>({
		resolver: zodResolver(accountFormSchema),
		defaultValues,
	});

	function onSubmit(data: AccountFormValues) {
		if (!data.email && !data.phone) {
			setIsEmailPhoneBothEmpty(true);
			return;
		}
		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
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
							<FormDescription>
								This is the name that will be displayed on your profile and in emails.
							</FormDescription>
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
				<Button type="submit">Update account</Button>
			</form>
		</Form>
	);
}
