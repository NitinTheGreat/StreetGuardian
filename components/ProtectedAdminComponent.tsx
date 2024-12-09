"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";

type ProtectedAdminProps = Record<string, unknown>; // Replaces [key: string]: any

export default function ProtectedAdminRoute<T extends ProtectedAdminProps>(
  Component: ComponentType<T>
) {
  return function ProtectedAdminComponent(props: T) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const verifyAdminToken = async () => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          router.push("/admin/login");
          return;
        }

        try {
          const response = await fetch("/api/verify-admin-token", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            router.push("/admindash");
            setIsAuthorized(true);
          } else {
            localStorage.removeItem("adminToken"); // Remove invalid token
            router.push("/admin/login");
          }
        } catch (error) {
          console.error("Admin token verification failed:", error);
          router.push("/admin/login");
        }
      };

      verifyAdminToken();
    }, [router]);

    if (!isAuthorized) {
      return null; // Optionally render a loading indicator
    }

    return <Component {...props} />;
  };
}
