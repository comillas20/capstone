import NextAuth from "next-auth";

type Roles = "ADMIN" | "USER";
declare module "next-auth" {
	interface User {
		id: number;
		role: Roles;
	}
	interface Session {
		user: User;
	}
	interface JWT {
		id: number;
		role: Roles;
	}
}
