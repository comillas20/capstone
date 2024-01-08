import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";

type OverviewCardsProps = {
	title: string;
	svg: React.ReactElement<"svg">;
	content: string;
	description?: string;
};
export default function OverviewCard({
	title,
	svg,
	content,
	description,
}: OverviewCardsProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{svg}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{content}</div>
				{description && (
					<p className="text-xs text-muted-foreground">{description}</p>
				)}
			</CardContent>
		</Card>
	);
}
