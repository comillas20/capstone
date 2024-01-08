"use client";
import img1 from "public/img1.jpg";
import img2 from "public/img2.jpg";
import img3 from "public/img3.jpg";
import { Button } from "@components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const fadeImages = [img1, img2, img3];

export default function Slideshow() {
	return (
		<div className="relative">
			<Fade
				pauseOnHover={false}
				transitionDuration={1000}
				cssClass="max-h-[40rem] w-full bg-secondary select-none"
				arrows={false}
				autoplay
				duration={2000}
				easing="ease-out"
				canSwipe={true}
				infinite={true}>
				<Image src={fadeImages[0]} alt="placeholder1" className="h-full w-full" />
				<Image src={fadeImages[1]} alt="placeholder2" className="h-full w-full" />
				<Image src={fadeImages[2]} alt="placeholder3" className="h-full w-full" />
			</Fade>
			<div className="-mt-[22px] flex justify-end pr-12">
				<Button className="z-10" size={"lg"}>
					<Link href={"/products"}>View Dishes</Link>
				</Button>
			</div>
		</div>
	);
}
