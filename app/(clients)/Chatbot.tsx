"use client";

import { Button } from "@components/ui/button";
import { MessageSquare } from "lucide-react";

export default function Chatbot() {
	return (
		<Button
			size={"icon"}
			className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full border border-white p-4">
			<MessageSquare className="aspect-square w-full" />
		</Button>
	);
}
