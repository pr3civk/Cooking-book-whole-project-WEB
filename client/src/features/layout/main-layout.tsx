import type { ReactNode } from "react";
import { Header } from "./nav/header";
import { Footer } from "./nav/footer";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
