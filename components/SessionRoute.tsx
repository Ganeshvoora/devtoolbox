"use client"
// import React from 'react'
// import { SessionProvider } from "next-auth/react";

// const SessionRoute = ({children}: {
//   children: React.ReactNode;
// }) => {
//   return (
//     <SessionProvider>
//       {children}
//     </SessionProvider>
//   )
// }

// export default SessionRoute
// Inside SessionRoute.tsx
import { usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/signin", "/signup","/"];

export default function SessionRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }
  
  // ...existing auth logic...
}