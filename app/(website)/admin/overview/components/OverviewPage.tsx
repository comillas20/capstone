"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@components/ui/card";
import { Sales } from "@app/(website)/admin/overview/components/Sales";
import { RecentClients } from "@app/(website)/admin/overview/components/RecentClients";
import { Separator } from "@components/ui/separator";
import { MonthYearPicker } from "@app/(website)/admin/overview/components/MonthYearPicker";
import OverviewCard from ".//OverviewCard";
import { Activity, DollarSign, UserPlus, UsersIcon } from "lucide-react";

type OverviewProps = {
	cards: {
		title: string;
	};
};
export default function Overview() {
	const cards = [
		{
			title: "Total Revenue",
			svg: (
				<DollarSign
					size={16}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-muted-foreground"
				/>
			),
			content: "$45,231.89",
			description: "+20.1% from last month",
		},
		{
			title: "Subscriptions",
			svg: (
				<UserPlus
					size={16}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-muted-foreground"
				/>
			),
			content: "+2350",
			description: "+180.1% from last month",
		},
		{
			title: "Sales",
			svg: (
				<UsersIcon
					size={16}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-muted-foreground"
				/>
			),
			content: "+12,234",
			description: "+19% from last month",
		},
		{
			title: "Active Reservations",
			svg: (
				<Activity
					size={16}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-muted-foreground"
				/>
			),
			content: "3",
			description: undefined,
		},
	];
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between space-y-2">
				<div className="space-y-0.5">
					<h2 className="text-3xl font-bold tracking-tight">Overview</h2>
					<p className="text-muted-foreground">
						Relevant statistics for the business
					</p>
				</div>
				<div>
					<MonthYearPicker />
				</div>
			</div>
			<Separator />
			<div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
				<div className="flex flex-col space-y-4 md:block">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{cards.map(card => (
							<OverviewCard
								title={card.title}
								svg={card.svg}
								content={card.content}
								description={card.description}
							/>
						))}
					</div>
					<div className="flex flex-col gap-4 lg:grid lg:grid-cols-7">
						<Card className="lg:col-span-4">
							<CardHeader>
								<CardTitle>Sales 2023</CardTitle>
							</CardHeader>
							<CardContent className="pl-2">
								<Sales />
							</CardContent>
						</Card>
						<Card className="lg:col-span-3">
							<CardHeader>
								<CardTitle>Recent Clients</CardTitle>
								<CardDescription>You had 6 clients this month.</CardDescription>
							</CardHeader>
							<CardContent>
								<RecentClients />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
