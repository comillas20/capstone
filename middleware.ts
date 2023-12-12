import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		if (
			req.nextUrl.pathname.startsWith("/admin") &&
			req.nextauth.token?.role !== "ADMIN"
		)
			return NextResponse.rewrite(new URL("/denied", req.url));
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	}
);

export const config = { matcher: ["/admin/:path*", "/settings/:path*"] };
