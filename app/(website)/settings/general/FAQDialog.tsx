"use client";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { Label } from "@components/ui/label";
import { useState } from "react";
type Values = { id: number; question: string; answer: string };
type CreateOrUpdateFAQProps = {
	FAQ?: Values;
	children: React.ReactNode;
	prevValues?: Values[];
	onValueChange: (...event: any[]) => void;
};
export function CreateOrUpdateFAQ({
	FAQ,
	children,
	prevValues,
	onValueChange,
}: CreateOrUpdateFAQProps) {
	const defaultQ = FAQ && FAQ.question !== "Not set" ? FAQ.question : "";
	const defaultA = FAQ && FAQ.answer !== "Not set" ? FAQ.question : "";
	const [question, setQuestion] = useState<{
		value: string;
		error: string;
	}>({ value: defaultQ, error: "" });
	const [answer, setAnswer] = useState<{
		value: string;
		error: string;
	}>({ value: defaultA, error: "" });
	const [open, setOpen] = useState<boolean>(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild onClick={() => setOpen(true)}>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>FAQ</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label>Question</Label>
						<Input
							value={question.value}
							onChange={e => setQuestion({ value: e.target.value, error: "" })}
						/>
						<p className="text-destructive">{question.error}</p>
					</div>
					<div className="space-y-2">
						<Label>Answer</Label>
						<Textarea
							value={answer.value}
							onChange={e => setAnswer({ value: e.target.value, error: "" })}
						/>
						<p className="text-destructive">{answer.error}</p>
					</div>
				</div>
				<DialogFooter className="flex justify-end gap-4">
					<DialogClose type="button">Cancel</DialogClose>
					<Button
						type="button"
						onClick={() => {
							if (question.value.trim() && answer.value.trim()) {
								const values: { id: number; question: string; answer: string } = {
									id: FAQ ? FAQ.id : -1,
									question: question.value.trim(),
									answer: answer.value.trim(),
								};
								if (prevValues && prevValues.length > 0) {
									// if there are other new FAQ that is unsaved (id === -1), ignore them
									// otherwise filter out soon-to-be duplicates (records that will be replaced by newer records)
									const filtered = prevValues.filter(
										val => val.id === -1 || val.id !== values.id
									);
									onValueChange([...filtered, values]);
								} else onValueChange([values]);
								setQuestion({ value: "", error: "" });
								setAnswer({ value: "", error: "" });
								setOpen(false);
							} else {
								if (!question.value.trim())
									setQuestion(prev => ({
										value: prev.value,
										error: "This should not be empty",
									}));
								if (!answer.value.trim())
									setAnswer(prev => ({
										value: prev.value,
										error: "This should not be empty",
									}));
							}
						}}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
