import useSWR from "swr";
import { getAllSets } from "../serverActions";

export default function SetPage() {
	const allSets = useSWR("spGetAllSets", getAllSets, {
		revalidateOnReconnect: true,
	});
	return <div></div>;
}
