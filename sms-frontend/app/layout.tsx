import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return(
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}