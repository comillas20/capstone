import prisma from "@lib/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

export const options: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/api/auth/signIn",
		error: "/api/auth/signIn",
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				emailOrPhoneNumber: {
					label: "Email or Phone number:",
					type: "text",
				},
				password: {
					label: "Password:",
					type: "password",
				},
			},
			async authorize(credentials) {
				if (!credentials?.emailOrPhoneNumber || !credentials?.password) return null;
				const userFound = await prisma.account.findFirst({
					where: {
						OR: [
							{
								email: credentials.emailOrPhoneNumber,
							},
							{
								phoneNumber: credentials.emailOrPhoneNumber,
							},
						],
					},
				});

				if (!userFound) return null;

				const password = await bcrypt.compare(
					credentials.password,
					userFound.password
				);

				if (!password)
					throw new Error("Incorrect email/mobile number and password");

				return {
					id: userFound.id.toString(), //doesnt work, but causes an error when deleted
					userID: userFound.id.toString(),
					name: userFound.name,
					image: userFound.image,
					email: userFound.email,
					phoneNumber: userFound.phoneNumber,
					role: userFound.role,
					provider: "CREDENTIALS",
				};
			},
		}),
		GoogleProvider({
			profile(profile) {
				let userRole = "USER";

				if (profile?.email == "comillasjin20@gmail.com") {
					userRole = "ADMIN";
				}

				return {
					...profile,
					userID: profile.sub,
					role: userRole,
					image: profile.picture,
					provider: "GOOGLE",
				};
			},
			clientId: process.env.GOOGLE_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				return {
					...token,
					userID: user.userID,
					phoneNumber: user.phoneNumber,
					role: user.role,
					provider: user.provider,
				};
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					userID: token.userID,
					phoneNumber: token.phoneNumber,
					role: token.role,
					provider: token.provider,
				},
			};
		},
	},
};
