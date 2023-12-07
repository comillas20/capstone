"use client";

import { Button } from "@components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const uploadFormSchema = z.object({
	uploadFile: z.custom(file => file instanceof File, {
		message: "Only files with .xlsx extentions are allowed",
	}),
});
type UploadFormValues = z.infer<typeof uploadFormSchema>;

function onSubmit(values: UploadFormValues) {}

export default function RestoreBackUpForm() {
	const form = useForm<UploadFormValues>({
		resolver: zodResolver(uploadFormSchema),
		defaultValues: {
			uploadFile: undefined,
		},
	});
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				encType="multipart/form-data"
				className="flex flex-col space-y-8">
				<FormField
					control={form.control}
					name="uploadFile"
					render={({ field }) => (
						<FormItem className="space-y-2">
							<FormLabel>Upload backup file (.xlsx)</FormLabel>
							<FormControl>
								<Input
									type="file"
									onChange={e => {
										if (!e?.target?.files) return;
										else field.onChange(e.target.files[0]);
									}}
									accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="self-end">
					Upload
				</Button>
			</form>
		</Form>
	);
}
