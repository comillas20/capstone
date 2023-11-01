import { CheckboxWithText } from "@components/CheckboxWithText";
import { Input } from "@components/ui/input";
import React from "react";

type ProductFiltersProps = {
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	setFilters: React.Dispatch<React.SetStateAction<Set<string>>>;
	categories: string[];
	sets: string[];
};
export default function ProductFilters({
	setQuery,
	categories,
	sets,
	setFilters,
}: ProductFiltersProps) {
	return (
		<div className="border-b border-primary lg:w-1/6 lg:border-b-0">
			<div className="sticky top-0 mb-8 flex space-x-2 pt-12 lg:mb-0 lg:flex-col lg:gap-8 lg:space-x-0 lg:space-y-1">
				<Input
					className="mb-0 w-[200px] border border-foreground lg:w-full"
					placeholder="Search"
					onChange={e => setQuery(e.target.value)}
				/>
				<div className="flex gap-4 lg:flex-col">
					<span className="text-xs text-secondary-foreground">Categories</span>
					{categories.map((category, index) => (
						<CheckboxWithText
							key={index}
							onCheckedChange={() => {
								setFilters(prevFilters => {
									// modifying states directly is illegal, so...
									const newFilters = new Set(prevFilters);

									if (newFilters.has(category)) {
										newFilters.delete(category);
									} else {
										newFilters.add(category);
									}

									return newFilters;
								});
							}}>
							{category}
						</CheckboxWithText>
					))}
				</div>
				{/* <div className="flex gap-4 lg:flex-col">
					<span className="text-xs text-secondary-foreground">Sets</span>
					{sets.map((set, index) => (
						<CheckboxWithText
							key={index}
							onCheckedChange={() => {
								setFilters(prevFilters => {
									// modifying states directly is illegal, so...
									const newFilters = new Set(prevFilters);

									if (newFilters.has(set)) {
										newFilters.delete(set);
									} else {
										newFilters.add(set);
									}

									return newFilters;
								});
							}}>
							{set}
						</CheckboxWithText>
					))}
				</div> */}
			</div>
		</div>
	);
}
