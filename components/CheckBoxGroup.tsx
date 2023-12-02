"use client";
import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	ReactNode,
} from "react";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@lib/utils";

interface CheckboxGroupContextProps {
	checkedValues: string[];
	setCheckedValues: React.Dispatch<React.SetStateAction<string[]>>;
	isDisabled: boolean;
	maxChecks: number;
}

// Create a context for the group
const CheckboxGroupContext = createContext<
	CheckboxGroupContextProps | undefined
>(undefined);

interface CheckboxGroupProps {
	children: ReactNode;
	className?: string;
	maxChecks: number;
	onCheckedValuesChange: (checkedValues: string[]) => void;
	disabled?: boolean; //outside usage, e.g. when the set this CBG is under is not selected
}

// The group component
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
	children,
	className,
	maxChecks,
	onCheckedValuesChange,
	disabled,
}) => {
	const [checkedValues, setCheckedValues] = useState<string[]>([]);
	const [isDisabled, setIsDisabled] = useState(false);

	// Update the disabled state when the number of checked values changes
	useEffect(() => {
		if (maxChecks === 0) {
			setIsDisabled(true);
			setCheckedValues(
				React.Children.toArray(children)
					.filter(child => !!child)
					.map(child => (child as React.ReactElement).props.value) || []
			);
		}
	}, []);

	useEffect(() => {
		if (maxChecks !== 0) {
			setIsDisabled(checkedValues.length >= maxChecks || !!disabled);
		}
		onCheckedValuesChange(checkedValues);
	}, [checkedValues, maxChecks, onCheckedValuesChange]);

	// Provide the checked values and function to change them
	return (
		<CheckboxGroupContext.Provider
			value={{ checkedValues, setCheckedValues, isDisabled, maxChecks }}>
			<div className={cn("flex flex-col gap-2", className)}>{children}</div>
		</CheckboxGroupContext.Provider>
	);
};

interface CheckboxItemProps {
	value: string;
	name: string;
	className?: string;
}

// The item component
export const CheckboxItem: React.FC<CheckboxItemProps> = ({
	value,
	name,
	className,
}) => {
	// Use the context to access the checked values and function to change them
	const { checkedValues, setCheckedValues, isDisabled, maxChecks } = useContext(
		CheckboxGroupContext
	) as CheckboxGroupContextProps;

	const isChecked = checkedValues.includes(value);
	const toggleCheck = () => {
		if (isChecked) {
			setCheckedValues(checkedValues.filter(v => v !== value));
		} else if (!isDisabled || isChecked) {
			setCheckedValues([...checkedValues, value]);
		}
	};

	return (
		<label
			className={cn(
				"flex items-center gap-4 space-x-2 text-sm font-medium leading-none",
				isDisabled &&
					"group-disabled/check:cursor-not-allowed group-disabled:opacity-70",
				className
			)}>
			<Checkbox
				className="group/check"
				checked={isChecked}
				onCheckedChange={toggleCheck}
				disabled={maxChecks === 0 || (isDisabled && !isChecked)}
			/>
			{name}
		</label>
	);
};
