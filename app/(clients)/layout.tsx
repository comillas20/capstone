import { Button } from "@components/ui/button";
import { FacebookIcon } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-y-12">
			<main className="flex-1 space-y-4 px-32 py-4">{children}</main>
			<footer className="flex justify-around gap-8 bg-secondary p-8">
				<div className="flex-1 p-4">
					<h5 className="font-semibold">Terms and Conditions</h5>
					<p>
						By utilizing our catering service, you agree to the following terms and
						conditions: We strive for exceptional service and food quality. Payment
						terms will be as agreed upon. Any alterations or cancellations should be
						communicated within the specified timeframe. Customer satisfaction is our
						priority, aiming to surpass expectations at every event.
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
