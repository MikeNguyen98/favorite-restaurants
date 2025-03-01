import { initTRPC } from "@trpc/server";
import { prisma } from "./db/prisma";

export const createTRPCContext = () => ({ db: prisma });

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
