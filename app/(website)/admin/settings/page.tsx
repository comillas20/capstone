import { RedirectType, redirect } from "next/navigation";

export default function Settings() {
	return <>{redirect("/admin/settings/account", RedirectType.replace)}</>;
}
