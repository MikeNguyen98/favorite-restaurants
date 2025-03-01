"use client"; // Important for App Router

import { httpBatchLink } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./trpc";
import { useState } from "react";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: "/api/trpc",
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
