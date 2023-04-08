import { User } from "@clerk/nextjs/dist/api";
import { z } from "zod";
import { DEFAULT_AVATAR } from "~/constants";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  FilteredUserForClientType,
  filteredUserForClient,
} from "~/server/helpers";

export const userRouter = createTRPCRouter({
  /**
   * Upsert a user
   */
  upsertUser: protectedProcedure
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
      console.log(`User input= ${input}`);

      const id = input?.user?.id;
      const name = input?.user?.name;
      const username = input?.user?.username;
      const email = input?.user?.email;
      const image = input?.user?.image;

      const user = await ctx.prisma.user.upsert({
        where: {
          email,
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

      console.log(`User= ${user}`);

      const userData: FilteredUserForClientType = {
        id: user?.id,
        username: user.username,
        fullName: user.name || "",
        profileImageUrl: user.image || DEFAULT_AVATAR,
      };

      const userDetails = filteredUserForClient(userData);

      console.log(`User details after mutation ${userDetails}`);

      return input;
    }),
});
