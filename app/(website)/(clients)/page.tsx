import Link from "next/link";
import Slideshow from "./Slideshow";
import Chatbot from "./Chatbot";
import { FacebookIcon } from "lucide-react";

export default function LandingPage() {
	return (
		<div className="-mx-32 -my-4">
			<main>
				<Slideshow />
				{/* insert texts */}
				<Chatbot />
			</main>

			<footer className="flex justify-around gap-8 bg-secondary p-8">
				<div className="flex-1 p-4">
					<h5 className="font-semibold">Terms of Payment</h5>
					<p>
						Down payment for reservation of the venue{" "}
						<strong className="text-primary">
							(Non refundable and non-consumable once you cancel your booking)
						</strong>
						. Full payment of your booking should be three (3) days before your
						function
					</p>
				</div>
				<div className="flex-1 p-4">
					<h5 className="font-semibold">About Us</h5>
					<p>
						We're dedicated to crafting unforgettable dining experiences. From
						intimate gatherings to large events, we specialize in creating delectable
						menus tailored to your unique tastes. With attention to detail and a
						passion for great food, we're here to make your moments special.
					</p>
				</div>
				<div className="flex flex-1 flex-col">
					<div className="px-5 py-4">
						<h5 className="font-semibold">Contact us</h5>
						<p>Contact Number: 091234567</p>
					</div>

					<div className="flex flex-1 items-end gap-4">
						<Link
							className="group flex items-center rounded p-4 hover:bg-background"
							href="https://www.facebook.com/jakeloucateringsurigao"
							target="_blank">
							<div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-input bg-background p-3 text-sm font-medium group-hover:bg-accent group-hover:text-accent-foreground">
								<FacebookIcon className="h-[1.2rem] w-[1.2rem]" />
							</div>
							<div className="ml-4 space-y-1">
								<p className="text-sm font-medium leading-none">Jakelou Catering </p>
								<p className="text-sm text-muted-foreground">
									facebook.com/jakeloucateringsurigao
								</p>
							</div>
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
