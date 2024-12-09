"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedAdminRoute(Component: any) {
  return function ProtectedAdminComponent(props: any) {
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
