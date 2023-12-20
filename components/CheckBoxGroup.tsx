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
	maxChecks?: number;
}

// Create a context for the group
const CheckboxGroupContext = createContext<
	CheckboxGroupContextProps | undefined
>(undefined);

interface CheckboxGroupProps {
	children: ReactNode;
	className?: string;
	maxChecks?: number;
	checkedValues: string[];
	setCheckedValues: React.Dispatch<React.SetStateAction<string[]>>;
	disabled?: boolean; //disables the entire checkbox group using outside logic
}

// The group component
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
	children,
	className,
	maxChecks,
	checkedValues,
	setCheckedValues,
	disabled,
}) => {
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
		if (maxChecks && maxChecks !== 0) {
			setIsDisabled(checkedValues.length >= maxChecks || !!disabled);
		}
		// setCheckedValues(checkedValues);
	}, [checkedValues, maxChecks, setCheckedValues]);

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
	children: React.ReactNode;
	className?: string;
	disabled?: boolean; // disable an item using outside logic
}

// The item component
export const CheckboxItem: React.FC<CheckboxItemProps> = ({
	value,
	children,
	className,
	disabled,
}) => {
	// Use the context to access the checked values and function to change them
	const { checkedValues, setCheckedValues, isDisabled, maxChecks } = useContext(
		CheckboxGroupContext
	) as CheckboxGroupContextProps;

	// if an item is in te array of selected values
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
				(isDisabled || disabled) &&
					"group-disabled/check:cursor-not-allowed group-disabled:opacity-70",
				className
			)}>
			<Checkbox
				className="group/check"
				checked={isChecked}
				onCheckedChange={toggleCheck}
				disabled={disabled || maxChecks === 0 || (isDisabled && !isChecked)}
			/>
			{children}
		</label>
	);
};
