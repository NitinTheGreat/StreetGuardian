"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";

type ProtectedComponentProps = {
  [key: string]: unknown;
};

export default function ProtectedComponent<T extends ProtectedComponentProps>(
  WrappedComponent: ComponentType<T>
): ComponentType<T> {
  return function ProtectedComponentWrapper(props: T) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const verifyToken = async () => {
        const token = localStorage.getItem("token");
        const adminToken = localStorage.getItem("adminToken");
        const authToken = token || adminToken;

        if (!authToken) {
          router.push("/login");
          return;
        }

        try {
          const response = await fetch("/api/verify-unified-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: authToken }),
          });

          if (response.ok) {
            setIsAuthorized(true);
          } else {
            localStorage.removeItem(token ? "token" : "adminToken");
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
      return null; // Optionally replace with a loading indicator
    }

    return <WrappedComponent {...props} />;
  };
}
