import NextAuth from "next-auth";

type Role = "ADMIN" | "USER";
declare module "next-auth" {
	interface User {
		phoneNumber: string | null;
		role: Role;
	}
	interface Session {
		user: User & {
			phoneNumber: string | null;
			role: Role;
		};
		token: {
			phoneNumber: string | null;
			role: Role;
		};
	}
}
