"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type SalesProps = {
	reservationData: {
		totalCost: number;
		status: "PENDING" | "PARTIAL" | "ONGOING" | "COMPLETED" | "CANCELLED";
		eventDate: Date;
	}[];
};
export function Sales({ reservationData }: SalesProps) {
	const filtered = reservationData.filter(rd => rd.status === "COMPLETED");
	const data = [
		{
			name: "Jan",
			total: reservationData
				.filter(entry => entry.eventDate.getMonth() === 0)
				.reduce((sum, entry) => sum + entry.totalCost, 0),
		},
		{
			name: "Feb",
			total: reservationData
				.filter(entry => entry.eventDate.getMonth() === 1)
				.reduce((sum, entry) => sum + entry.totalCost, 0),
		},
		{
			name: "Mar",
			total: reservationData
				.filter(entry => entry.eventDate.getMonth() === 2)
				.reduce((sum, entry) => sum + entry.totalCost, 0),
		},
		{
			name: "Apr",
			total: reservationData
				.filter(entry => entry.eventDate.getMonth() === 3)
				.reduce((sum, entry) => sum + entry.totalCost, 0),
		},
		{
			name: "May",
			total: reservationData
				.filter(entry => entry.eventDate.getMonth() === 4)
				.reduce((sum, entry) => sum + entry.totalCost, 0),
		},
		{
			name: "Jun",
			total: reservationData
				.filter(entry => entry.eventDate.getMonth() === 5)
				.reduce((sum, entry) => sum + entry.totalCost, 0),
		},
		{
			name: "Jul",
			total: reservationData
				.filter(entry => entry.eventDate.getMonth() === 6)
				.reduce((sum, entry) => sum + entry.totalCost, 0),
		},
		{
			name: "Aug",
			total: reservationData
				.filter(entry => entry.eventDate.getMonth() === 7)
				.reduce((sum, entry) => sum + entry.totalCost, 0),
		},
		{
			name: "Sep",
			total: reservationData
				.filter(entry => entry.eventDate.getMonth() === 8)
				.reduce((sum, entry) => sum + entry.totalCost, 0),
		},
		{
			name: "Oct",
			total: reservationData
				.filter(entry => entry.eventDate.getMonth() === 9)
				.reduce((sum, entry) => sum + entry.totalCost, 0),
		},
		{
			name: "Nov",
			total: reservationData
				.filter(entry => entry.eventDate.getMonth() === 10)
				.reduce((sum, entry) => sum + entry.totalCost, 0),
		},
		{
			name: "Dec",
			total: reservationData
				.filter(entry => entry.eventDate.getMonth() === 11)
				.reduce((sum, entry) => sum + entry.totalCost, 0),
		},
	];
	return (
		<ResponsiveContainer width="100%" height={288}>
			<BarChart data={data}>
				<XAxis
					dataKey="name"
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={value => `₱${value}`}
				/>
				<Bar dataKey="total" fill="#E63946" radius={[4, 4, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}
