import NextAuth from "next-auth";

type Roles = "ADMIN" | "USER";
type Providers = "CREDENTIALS" | "GOOGLE" | "FACEBOOK";
declare module "next-auth" {
	interface User {
		userID: string;
		phoneNumber?: string | null;
		role: Roles;
		provider: Providers;
	}
	interface Session {
		user: User;
		token: User;
	}
}
