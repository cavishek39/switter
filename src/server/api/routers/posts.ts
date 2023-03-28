import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

/**
 * This is the posts router for your server.
 *
 * All the posts related routers added in /api/routers should be manually added here.
 */

const filteredPosts = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: 100,
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post?.authorId),
        limit: 100,
      })
    ).map(filteredPosts);

    return posts.map((post) => {
      const author = users.find((user) => user?.id === post?.authorId);
      return {
        post,
        author,
      };
    });
  }),

  createPost: protectedProcedure
    .input(
      z.object({ content: z.string().min(1).max(280), authorId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = input?.authorId;

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input?.content,
        },
      });

      return post;
    }),
});
