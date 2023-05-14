import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  FilteredUserForClientType,
  UserForClientType,
  filteredUserForClient,
} from "~/helpers";

/**
 * This is the profile router for your server.
 *
 * All the profile related routers added in /api/routers should be manually added here.
 */

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const username = input?.username;
      const currentUserId = ctx.currentUserId;

      const [user] = await clerkClient.users.getUserList({
        username: [username],
      });

      const userData = await ctx.prisma.user.findUnique({
        where: { username },
        select: {
          name: true,
          bio: true,
          email: true,
          location: true,
          website: true,
          image: true,
          _count: {
            select: {
              followers: true,
              follows: true,
            },
          },
          followers:
            currentUserId == null
              ? undefined
              : { where: { id: currentUserId } },
        },
      });

      const userForClient: FilteredUserForClientType = {
        id: user?.id || "",
        username: user?.username || "",
        profileImageUrl: user?.profileImageUrl || "",
        fullName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
        createdAt: user?.createdAt || Number(new Date().toISOString()),
        email: user?.emailAddresses?.[0]?.emailAddress || "",
        bio: userData?.bio || "",
        location: userData?.location || "",
        website: userData?.website || "",
        followersCount: userData?._count?.followers || 0,
        followingCount: userData?._count?.follows || 0,
        isFollowing:
          userData?.followers?.some(
            (follower) => follower.id === currentUserId
          ) || false,
        birthday: user?.birthday || "",
      };

      // console.log("User followers data ", userData?.followers);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return filteredUserForClient(userForClient as UserForClientType);
    }),

  // Follow / UnFollow a user
  toggleFollowUser: protectedProcedure
    .input(z.object({ followerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const otherUserId = input?.followerId;
      const currentUserId = ctx.currentUserId;
      console.log({ otherUserId, currentUserId });

      if (!currentUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to follow a user",
        });
      }

      const existingFollow = await ctx.prisma.user.findFirst({
        where: {
          id: otherUserId,
          followers: {
            some: {
              id: currentUserId,
            },
          },
        },
      });

      let isFollowing;

      if (existingFollow === null) {
        await ctx.prisma.user.update({
          where: {
            id: otherUserId,
          },
          data: {
            followers: {
              connect: {
                id: currentUserId,
              },
            },
          },
        });
        isFollowing = true;
      } else {
        await ctx.prisma.user.update({
          where: {
            id: otherUserId,
          },
          data: {
            followers: {
              disconnect: {
                id: currentUserId,
              },
            },
          },
        });
        isFollowing = false;
      }

      void ctx.revalidateSSG?.(`/profiles/${otherUserId}`);
      void ctx.revalidateSSG?.(`/profiles/${currentUserId}`);

      return { isFollowing };
    }),
});
