import PrivateRoute from "@/components/PrivateRoute";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PrivateRoute>
          {children}
        </PrivateRoute>
      </body>
    </html>
  );
}
