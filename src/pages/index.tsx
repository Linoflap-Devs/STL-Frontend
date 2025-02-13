// src\pages\index.tsx.

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      console.log("No token found, redirecting to login...");
      router.replace("/auth/login");
    } else {
      console.log("Token found, redirecting to dashboard...");
      router.replace("/managers");
    }
  }, [router]);

  return null;
}
