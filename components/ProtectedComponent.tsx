"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";

type ProtectedRouteProps = {}; // Define specific shared props if applicable.

export default function ProtectedRoute<T extends ProtectedRouteProps>(
  Component: ComponentType<T>
) {
  const ProtectedComponent = (props: T) => {
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
            localStorage.removeItem("token");
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
      return <div>Loading...</div>; // Optional loading indicator.
    }

    return <Component {...props} />;
  };

  return ProtectedComponent;
}
