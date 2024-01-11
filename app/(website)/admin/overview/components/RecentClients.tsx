import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@components/ui/card";

type RecentClientsProps = {
	className?: string;
	data: {
		id: number;
		name: string;
		phoneNumber: string;
		revenue: number;
	}[];
};
export function RecentClients({ className, data }: RecentClientsProps) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Recent Clients</CardTitle>
				<CardDescription>{`You had ${data.length} clients this month.`}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="max-h-[300] space-y-8">
					{data.map(d => (
						<div key={d.id} className="flex items-center">
							<Avatar className="h-9 w-9">
								{/* <AvatarImage src="/avatars/01.png" alt="Avatar" /> */}
								<AvatarFallback>
									{d.name ? d.name.charAt(0).toUpperCase() : "?"}
								</AvatarFallback>
							</Avatar>
							<div className="ml-4 space-y-1">
								<p className="text-sm font-medium leading-none">
									{d.name ?? "Anonymous"}
								</p>
								<p className="text-sm text-muted-foreground">{d.phoneNumber}</p>
							</div>
							<div className="ml-auto font-medium">
								{new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: "PHP",
								}).format(d.revenue)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
