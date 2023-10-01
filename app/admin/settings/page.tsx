import { redirect } from "next/navigation";

export default function Settings() {
	return <>{redirect("/admin/settings/account")}</>;
}
