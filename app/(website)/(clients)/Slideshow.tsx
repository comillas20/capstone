"use client";
import img1 from "@app/sample/placeholder1.jpg";
import img2 from "@app/sample/placeholder2.jpg";
import img3 from "@app/sample/placeholder3.jpg";
import { Button } from "@components/ui/button";
import Image from "next/image";
import Link from "next/link";
// import { useEffect, useState } from "react";
// export default function Slideshow() {
// 	const slides = [img1, img2, img3];
// 	const [slideIndex, setSlideIndex] = useState(0);

// 	const showSlides = () => {
// 		setSlideIndex(prevIndex => (prevIndex + 1) % slides.length);
// 	};

// 	useEffect(() => {
// 		const intervalId = setInterval(showSlides, 4000);

// 		return () => clearInterval(intervalId);
// 	}, [slideIndex]);
// 	return (
// 		<div className="h-[40rem] w-full bg-secondary">
// 			<Image
// 				src={slides[slideIndex]}
// 				alt="placeholder1"
// 				className="h-full w-full transition-opacity fade-in-5 fade-out-5"
// 				objectFit="cover"
// 			/>
// 		</div>
// 	);
// }

import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const fadeImages = [img1, img2, img3];

export default function Slideshow() {
	return (
		<>
			<Fade
				pauseOnHover={false}
				transitionDuration={1000}
				cssClass="max-h-[40rem] w-full bg-secondary"
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
		</>
	);
}
