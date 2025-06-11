
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";


interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return <div>Loading...</div>; 
  }

  if (!session) {
    router.push("/signin"); 
    return <div>Redirecting...</div>; 
  }

  return <><SessionProvider >{children}</SessionProvider></>;
};

export default PrivateRoute;

