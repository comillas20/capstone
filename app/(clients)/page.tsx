import Link from "next/link";
import Slideshow from "./Slideshow";
import Chatbot from "./Chatbot";

export default function LandingPage() {
	return (
		<div className="-mx-32 -my-4">
			<Slideshow />
			<Chatbot />
		</div>
	);
}
