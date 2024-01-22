"use client";
import { Session } from "next-auth";
import ReservationTable from "./ReservationTable";
import useSWR from "swr";
import { getReservations } from "../serverActions";
import { columns } from "./Columns";

type ReservationList = {
	session: Session | null;
};
export default function ReservationList({ session }: ReservationList) {
	const reservations = useSWR("ReservationListData", async () => {
		return session ? getReservations(session.user.id) : null;
	});
	return (
		reservations &&
		reservations.data && (
			<ReservationTable data={reservations.data} columns={columns} />
		)
	);
}
