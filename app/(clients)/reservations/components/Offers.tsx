"use client";
import { Button } from "@components/ui/button";
import SetCards from "./SetCards";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
const samepleCard = [
	{
		category: "Pork",
		dishes: [
			"Pork Ribs",
			"Pork Steak Kaldereta",
			"Sweet & Sour Pork",
			"Sweet & Sour Meatballs",
		],
	},
	{
		category: "Chicken",
		dishes: [
			"Battered Fried Chicken",
			"Garlic Chicken",
			"Chicken Adobo",
			"Chicken Curry",
		],
	},
	{
		category: "Fish/Canton/Vegetable",
		dishes: [
			"Breaded Fish Fillet",
			"Sweet & Sour Fish",
			"Fish Tausi",
			"Chopsuey Guisado",
			"Sotanghon Guisado Special",
			"Bam-I",
			"Pancit Canton",
			"Lumpia Shanghai",
		],
	},
];
const cards = ["₱200/Head", "₱320/Head", "₱350/Head", "₱3510/Head"];
export default function Offers() {
	const [selected, setSelected] = useState("");
	const [itemsToDisplay, setItemsToDisplay] = useState(1);
	const [visibleItems, setVisibleItems] = useState(
		cards.slice(0, itemsToDisplay)
	);
	let startItem = useRef(0);
	useEffect(() => {
		const handleResize = () => {
			const newItemsToDisplay = window.innerWidth < 1450 ? 1 : 3;
			setItemsToDisplay(newItemsToDisplay);
			if (startItem.current > cards.length - newItemsToDisplay) {
				startItem.current = cards.length - newItemsToDisplay;
			}
			setVisibleItems(
				cards.slice(startItem.current, startItem.current + newItemsToDisplay)
			);
		};
		handleResize();

		// Cant directly put window.innerWidth as dependency in useEffect, so I had to do this
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<>
			<div className="mb-14 flex justify-between gap-4 ">
				{cards.length > itemsToDisplay && (
					<Button
						className="h-fit self-center"
						onClick={() => {
							if (startItem.current > 0) {
								startItem.current--;
								setVisibleItems(
									cards.slice(startItem.current, startItem.current + itemsToDisplay)
								);
							}
						}}
						disabled={startItem.current === 0}>
						<ChevronLeft height={100} />
					</Button>
				)}
				<div className="flex flex-1 flex-col justify-between gap-4 min-[1450px]:flex-row">
					{visibleItems.map(card => (
						<SetCards
							key={card}
							title={card}
							products={samepleCard}
							onClick={() => setSelected(card)}
							selected={selected === card}></SetCards>
					))}
				</div>
				{cards.length > itemsToDisplay && (
					<Button
						className="h-fit self-center"
						onClick={() => {
							if (startItem.current < cards.length - itemsToDisplay) {
								startItem.current++;
								setVisibleItems(
									cards.slice(startItem.current, startItem.current + itemsToDisplay)
								);
							}
						}}
						disabled={startItem.current === cards.length - itemsToDisplay}>
						<ChevronRight height={100} />
					</Button>
				)}
			</div>
		</>
	);
}
