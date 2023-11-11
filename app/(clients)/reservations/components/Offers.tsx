"use client";
import { Button } from "@components/ui/button";
import SetCards from "./SetCards";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sets } from "./temp";

type OffersProps = {
	setSelectedItems: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};
export default function Offers() {
	const [selected, setSelected] = useState(0);
	const [selectedItems, setSelectedItems] = useState<Record<string, string>>({});

	function selectItems(category: string, product: string) {
		setSelectedItems(prevItems => {
			const current = prevItems;
			current[category] = product;
			return current;
		});
	}

	return (
		<div className="mb-14 flex justify-between gap-4 rounded-sm border">
			{sets.length > 1 && (
				<Button
					className="h-full self-center rounded-e-none"
					onClick={() => {
						if (selected > 0) {
							setSelected(selected - 1);
						}
					}}
					disabled={selected === 0}>
					<ChevronLeft className="h-96" />
				</Button>
			)}
			<SetCards
				title={sets[selected].name}
				products={sets[selected].products}
				selected
				selectProducts={selectItems}></SetCards>
			{sets.length > 1 && (
				<Button
					className="h-full self-center rounded-s-none"
					onClick={() => {
						if (selected < sets.length - 1) {
							setSelected(selected + 1);
						}
					}}
					disabled={selected === sets.length - 1}>
					<ChevronRight className="h-96" />
				</Button>
			)}
		</div>
	);
}
