import { RedirectType, redirect } from "next/navigation";

export default function Settings() {
	return <>{redirect("/settings/account", RedirectType.replace)}</>;
}
