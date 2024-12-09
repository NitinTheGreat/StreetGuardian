"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute(Component: any) {
  return function ProtectedComponent(props: any) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const verifyToken = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        try {
          const response = await fetch("/api/verify-user-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            setIsAuthorized(true);
          } else {
            localStorage.removeItem("token"); // Remove invalid token
            router.push("/login");
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          router.push("/login");
        }
      };

      verifyToken();
    }, [router]);

    if (!isAuthorized) {
      return null; // Optionally render a loading indicator
    }

    return <Component {...props} />;
  };
}
