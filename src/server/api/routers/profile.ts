import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  FilteredUserForClientType,
  UserForClientType,
  filteredUserForClient,
} from "~/server/helpers";

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

      const [user] = await clerkClient.users.getUserList({
        username: [username],
      });

      const userData = await ctx.prisma.user.findUnique({
        where: { username },
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
      };

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return filteredUserForClient(userForClient as UserForClientType);
    }),
});
