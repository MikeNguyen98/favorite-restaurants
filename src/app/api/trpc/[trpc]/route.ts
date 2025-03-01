import { createTRPCContext } from "@/server/context";
import { appRouter } from "@/server/router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
};

export { handler as GET, handler as POST };
