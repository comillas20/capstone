"use client";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";
import { MessageSquare } from "lucide-react";

type FAQProps = {
	data: {
		id: number;
		question: string;
		answer: string;
	}[];
};
export default function FAQ({ data }: FAQProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size={"icon"}
					className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full border border-white p-4">
					<MessageSquare className="aspect-square w-full" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="relative right-24" side="top">
				<h4 className="text-lg font-medium">FAQs</h4>
				<Accordion type="single" collapsible className="w-full">
					{data.map(faq => (
						<AccordionItem value={String(faq.id)}>
							<AccordionTrigger>{faq.question}</AccordionTrigger>
							<AccordionContent>{faq.answer}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</PopoverContent>
		</Popover>
	);
}