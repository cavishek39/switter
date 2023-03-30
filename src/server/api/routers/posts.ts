import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { useUser } from "@clerk/nextjs";

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

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const postsRouter = createTRPCRouter({
  /**
   * Get all posts
   */
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

  /**
   * Create a post
   */
  createPost: protectedProcedure
    .input(
      z.object({ content: z.string().min(1).max(280), authorId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = input?.authorId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input?.content,
        },
      });

      return post;
    }),

  /**
   * Update a post
   */
  updatePost: protectedProcedure
    .input(
      z.object({ postId: z.string(), content: z.string().min(1).max(280) })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = useUser();
      const authorId = user?.id;
      const id = input?.postId;
      const content = input?.content;

      const { success } = await ratelimit.limit(id);

      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post ID is missing...!",
        });
      }

      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const updatedPost = await ctx.prisma.post.update({
        where: {
          id,
        },
        data: {
          id,
          authorId,
          content,
          created_at: new Date(),
        },
      });

      return updatedPost;
    }),

  /**
   * Delete a post
   */
  deletePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = input?.postId;

      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post ID is missing...!",
        });
      }

      const { success } = await ratelimit.limit(id);

      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const deletedPost = await ctx.prisma.post.delete({
        where: {
          id,
        },
      });

      return deletedPost;
    }),
});
