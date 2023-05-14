import { z } from "zod";
import { DEFAULT_AVATAR } from "~/constants";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  FilteredUserForClientType,
  UserForClientType,
  filteredUserForClient,
} from "~/helpers";

export const userRouter = createTRPCRouter({
  /**
   * Upsert a user
   */
  upsertUser: publicProcedure
    .input(
      z.object({
        user: z.object({
          id: z.string(),
          name: z.string(),
          username: z.string(),
          email: z.string(),
          image: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = input?.user?.id;
      const name = input?.user?.name;
      const username = input?.user?.username || "";
      const email = input?.user?.email || "";
      const image = input?.user?.image;

      const user = await ctx.prisma.user.upsert({
        where: {
          id,
        },
        update: {
          name,
          image,
        },
        create: {
          id,
          name,
          image,
          email,
          username,
        },
      });

      const userData: FilteredUserForClientType = {
        id: user?.id,
        username: user.username,
        fullName: user.name || "",
        profileImageUrl: user.image || DEFAULT_AVATAR,
        createdAt: Number(new Date().toISOString()),
        email: user.email || "",
      };

      return filteredUserForClient(userData as UserForClientType);
    }),

  /**
   * Updating some fields of a user
   */
  updateUser: protectedProcedure
    .input(
      z.object({
        user: z.object({
          id: z.string(),
          name: z.string(),
          image: z.string(),
          bio: z.optional(z.string()),
          location: z.optional(z.string()),
          website: z.optional(z.string()),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = input?.user?.id;
      const name = input?.user?.name;
      const image = input?.user?.image;
      const bio = input?.user?.bio;
      const location = input?.user?.location;
      const website = input?.user?.website;

      const user = await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          image,
          bio,
          location,
          website,
        },
      });

      const userData: FilteredUserForClientType = {
        id: user?.id,
        username: user.username,
        fullName: user.name || "",
        profileImageUrl: user.image || DEFAULT_AVATAR,
        createdAt: Number(new Date().toISOString()),
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
      };

      return userData;
    }),
});
