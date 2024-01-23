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
import {
	Activity,
	DollarSign,
	Loader2,
	UserPlus,
	UsersIcon,
} from "lucide-react";
import useSWR from "swr";
import { getAccounts, getReservations } from "../serverActions";
import { useState } from "react";
import { isAfter, isBefore, isSameMonth, isSameYear } from "date-fns";

export default function Overview() {
	const now = new Date();
	const [month, setMonth] = useState<number>(now.getMonth());
	const [year, setYear] = useState<number>(now.getFullYear());
	const reservations = useSWR(
		"OverviewReservations",
		async () => getReservations(new Date(year, 0)) // 0 == january
	);

	const accounts = useSWR("OverviewAccounts", getAccounts);

	if (reservations.data && accounts.data) {
		const thisMonthData = reservations.data.filter(r =>
			isSameMonth(r.eventDate, new Date(year, month))
		);
		const lastMonthData =
			month != 0
				? reservations.data.filter(r =>
						isSameMonth(r.eventDate, new Date(year, month - 1))
				  )
				: undefined;
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
							reservations={thisMonthData}
						/>
					</div>
				</div>
				<Separator />
				<div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
					<div className="flex flex-col space-y-4 md:block">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							{(() => {
								const thisMonthRevenue = thisMonthData
									.filter(data => isBefore(data.eventDate, now))
									.reduce((acc, reservation) => acc + reservation.totalCost, 0);
								const lastMonthRevenue = lastMonthData?.reduce(
									(acc, reservation) => acc + reservation.totalCost,
									0
								);
								const percentage = lastMonthRevenue
									? getPercentage(lastMonthRevenue, thisMonthRevenue - lastMonthRevenue)
									: undefined;
								return (
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
											}).format(thisMonthRevenue)
										)}
										description={
											percentage ? addSign(percentage) + "% from last month" : undefined
										}
									/>
								);
							})()}

							{(() => {
								const thisMonthSubs = accounts.data.filter(account =>
									isSameMonth(account.createdAt, new Date(year, month))
								).length;
								const lastMonthSubs =
									month != 0
										? accounts.data.filter(account =>
												isSameMonth(account.createdAt, new Date(year, month - 1))
										  ).length
										: undefined;
								const percentage = lastMonthSubs
									? getPercentage(lastMonthSubs, thisMonthSubs - lastMonthSubs)
									: undefined;
								return (
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
										content={addSign(thisMonthSubs)}
										description={
											percentage ? addSign(percentage) + "% from last month" : undefined
										}
									/>
								);
							})()}

							{(() => {
								const currentSales = thisMonthData.filter(
									r => !(r.status === "CANCELLED") && !isAfter(r.eventDate, now)
								).length;
								const lastMonthSales = lastMonthData ? lastMonthData.length : undefined;
								const percentage = lastMonthSales
									? currentSales / (currentSales - lastMonthSales)
									: undefined;
								return (
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
										content={addSign(currentSales)}
										description={
											percentage
												? addSign(percentage * 100) + "% from last month"
												: undefined
										}
									/>
								);
							})()}

							{(() => {
								const completed = reservations.data.filter(
									r => r.status === "COMPLETED"
								).length;
								const ongoing = reservations.data.filter(
									r => r.status === "ONGOING"
								).length;
								return (
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
										content={String(completed + ongoing)}
										description={completed + " completed; " + ongoing + " ongoing"}
									/>
								);
							})()}
						</div>
						<div className="flex flex-col gap-4 lg:grid lg:grid-cols-7">
							{(() => {
								const entireYear = reservations.data.filter(r =>
									isSameYear(r.eventDate, new Date(year, 0))
								);
								return (
									<Card className="lg:col-span-4">
										<CardHeader>
											<CardTitle>Sales 2023</CardTitle>
										</CardHeader>
										<CardContent className="pl-2">
											<Sales reservationData={entireYear} />
										</CardContent>
									</Card>
								);
							})()}

							{(() => {
								type Account = {
									createdAt: Date;
									id: number;
									name: string;
									phoneNumber: string;
									image: string | null;
								};
								const ids = accounts.data.map(account => account.id);
								const clients = thisMonthData.filter(item => ids.includes(item.userID));
								const data = clients.map(client => {
									const account = accounts.data?.find(
										account => account.id === client.userID
									) as Account;
									return {
										id: client.userID,
										name: account.name,
										phoneNumber: account.phoneNumber,
										revenue: client.totalCost,
									};
								});
								return <RecentClients className="lg:col-span-3" data={data} />;
							})()}
						</div>
					</div>
				</div>
			</div>
		);
	} else <div>Loading...</div>;
}

function addSign(num: number) {
	return num > 0 ? `+${num}` : String(num);
}

function getPercentage(base: number, value: number) {
	return (value / base) * 100;
}
