// src\middleware.ts

import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  console.log("Token:", token);

  if (req.nextUrl.pathname === "/auth/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow public routes if no token
  const publicRoutes = ["/auth/login", "/register"];
  if (!token) {
    if (!publicRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/getUsers`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Token validation failed");

    const data = await response.json();
    const userRole = data?.UserTypeId;

    if (!userRole) throw new Error("Invalid user data");

    // Redirect unauthorized users from manager pages
    if (req.nextUrl.pathname.startsWith("/managers") && userRole !== 2) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/auth/login"],
};
