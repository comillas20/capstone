import { HelpCircleIcon } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

type HelpTooltipProps = {
	children: React.ReactNode;
} & React.ComponentProps<typeof HelpCircleIcon>;
export default function HelpToolTip({ children, ...props }: HelpTooltipProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger type="button">
					<HelpCircleIcon {...props} />
				</TooltipTrigger>
				<TooltipContent>{children}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
