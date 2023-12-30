import prisma from "@lib/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const options: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/authentication/sign-in",
		error: "/authentication/sign-in",
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				phoneNumber: {
					label: "Phone number:",
					type: "text",
				},
				password: {
					label: "Password:",
					type: "password",
				},
			},
			async authorize(credentials) {
				if (!credentials?.phoneNumber || !credentials?.password) return null;
				const userFound = await prisma.account.findFirst({
					where: {
						phoneNumber: credentials.phoneNumber,
					},
				});

				if (!userFound) throw new Error("Incorrect mobile number and/or password");

				const password = await bcrypt.compare(
					credentials.password,
					userFound.password
				);

				if (!password) throw new Error("Incorrect mobile number and/or password");

				return {
					id: userFound.id,
					role: userFound.role,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				return {
					id: user.id,
					role: user.role,
				};
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				expires: session.expires,
				user: {
					...session.user,
					id: token.id,
					role: token.role,
				},
			};
		},
	},
};
