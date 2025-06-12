
"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";


interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  if (status === "loading") {
    return <div>Loading...</div>; 
  }

  if (!session && pathname !== "/") {
    router.push("/signin");
    // return <div>Redirecting...</div>;
    return null; // Prevents rendering while redirecting
  }

  return <><SessionProvider >{children}</SessionProvider></>;
};

export default PrivateRoute;

