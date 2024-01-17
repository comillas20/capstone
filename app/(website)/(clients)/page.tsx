import Link from "next/link";
import Slideshow from "./Slideshow";
import { FacebookIcon, Loader2, PhoneIcon } from "lucide-react";
import prisma from "@lib/db";
import FAQ from "./FAQ";
import { Button } from "@components/ui/button";

export default async function LandingPage() {
	try {
		const faq = await prisma.fAQ.findMany();
		const admin = await prisma.account.findFirst({
			where: {
				role: "ADMIN",
			},
			select: {
				phoneNumber: true,
			},
		});
		return (
			<div className="-mx-32 -my-4">
				<main>
					<Slideshow />
					{/* insert texts */}
					{faq && faq.length > 0 && <FAQ data={faq} />}
				</main>

				<footer className="flex flex-col justify-around gap-8 bg-secondary p-8 md:flex-row">
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
							We&apos;re dedicated to crafting unforgettable dining experiences. From
							intimate gatherings to large events, we specialize in creating delectable
							menus tailored to your unique tastes. With attention to detail and a
							passion for great food, we&apos;re here to make your moments special.
						</p>
					</div>
					<div className="flex flex-1 flex-col gap-4 p-4">
						<h5 className="font-semibold">Contact us</h5>
						<div className="flex flex-col gap-2">
							{admin && (
								<div className="flex w-full items-center rounded">
									<div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-input bg-background p-3 text-sm font-medium">
										<PhoneIcon className="h-[1.2rem] w-[1.2rem]" />
									</div>
									<div className="ml-4 space-y-1">
										<p className="text-sm font-medium leading-none">Manager </p>
										<p className="text-sm text-muted-foreground">{admin.phoneNumber}</p>
									</div>
								</div>
							)}

							<Link
								className="flex w-full items-center rounded"
								href="https://www.facebook.com/jakeloucateringsurigao"
								target="_blank">
								<div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-input bg-background p-3 text-sm font-medium">
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
	} catch (error) {
		return (
			<div className="flex h-screen flex-col items-center justify-center gap-4">
				<span>Something went wrong. Please refresh.</span>
				<Button>
					<Loader2 className="mr-4" />
					<Link href={"/"} replace>
						Refresh
					</Link>
				</Button>
			</div>
		);
	}
}
