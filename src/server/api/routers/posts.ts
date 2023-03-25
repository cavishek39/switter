import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/**
 * This is the posts router for your server.
 *
 * All the posts related routers added in /api/routers should be manually added here.
 */
export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
});
