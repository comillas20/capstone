import { getServerSession } from "next-auth";
import SignInForm from "./SignInForm";
import { options } from "../[...nextauth]/options";

export default async function SignInPage() {
	const session = await getServerSession(options);
	return <SignInForm />;
}
