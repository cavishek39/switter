import type { User } from "@clerk/nextjs/dist/api";

/**
 * This is the posts router for your server.
 *
 * All the posts related routers added in /api/routers should be manually added here.
 */

export type FilteredUserForClientType = {
  id: string;
  username: string;
  profileImageUrl: string;
  fullName: string;
  createdAt?: number;
};

export const filteredUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username || "",
    profileImageUrl: user.profileImageUrl,
    fullName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
    createdAt: user.createdAt,
  };
};
