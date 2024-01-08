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
import useSWR from "swr";
import { getReservations } from "@app/(website)/serverActionsGlobal";
import { useState } from "react";

export default function Overview() {
	const now = new Date();
	const [month, setMonth] = useState<number>(now.getMonth());
	const [year, setYear] = useState<number>(now.getFullYear());
	const reservations = useSWR("reservations", async () =>
		getReservations(undefined, new Date(year, month))
	);
	if (reservations.data)
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
						<MonthYearPicker
							key={year}
							currentDate={now}
							month={month}
							onMonthChange={setMonth}
							year={year}
							onYearChange={setYear}
							reservations={reservations.data}
						/>
					</div>
				</div>
				<Separator />
				<div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
					<div className="flex flex-col space-y-4 md:block">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<OverviewCard
								title="Total Revenue"
								svg={
									<DollarSign
										size={16}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-muted-foreground"
									/>
								}
								content={String(
									new Intl.NumberFormat("en-US", {
										style: "currency",
										currency: "PHP",
									}).format(
										reservations.data.reduce(
											(acc, reservation) => acc + reservation.net_amount + reservation.fee,
											0
										)
									)
								)}
								description="+20.1% from last month"
							/>
							<OverviewCard
								title="Subscriptions"
								svg={
									<UserPlus
										size={16}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-muted-foreground"
									/>
								}
								content="+2350"
								description="+180.1% from last month"
							/>
							<OverviewCard
								title="Sales"
								svg={
									<UsersIcon
										size={16}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-muted-foreground"
									/>
								}
								content="+12,234"
								description="+19% from last month"
							/>
							<OverviewCard
								title="Active Reservations"
								svg={
									<Activity
										size={16}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-muted-foreground"
									/>
								}
								content="4"
							/>
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
	else <div>Loading...</div>;
}
