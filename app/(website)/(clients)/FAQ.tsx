"use client";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";
import { MessageCircleQuestion } from "lucide-react";

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
					<MessageCircleQuestion className="aspect-square h-full w-full" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="relative right-24" side="top">
				<h4 className="text-lg font-medium">FAQs</h4>
				<Command className="space-y-4">
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							<Accordion type="single" collapsible className="w-full">
								{data.map(faq => (
									<AccordionItem key={faq.id} value={String(faq.id)}>
										<CommandItem>
											<AccordionTrigger>{faq.question}</AccordionTrigger>
										</CommandItem>
										<AccordionContent>{faq.answer}</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</CommandGroup>
					</CommandList>
					<CommandInput placeholder="Search for a question..." />
				</Command>
			</PopoverContent>
		</Popover>
	);
}
