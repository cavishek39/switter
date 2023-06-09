import type { User as ClerkUser } from "@clerk/nextjs/dist/api";
import { User as PrismaUser } from "@prisma/client";

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
  createdAt: number;
  bio?: string;
  website?: string;
  location?: string;
  email: string;
  likes?: number;
  likedById?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  birthday?: string;
};

export type UserForClientType = ClerkUser &
  PrismaUser &
  FilteredUserForClientType;

export const filteredUserForClient = (user: UserForClientType) => {
  return {
    id: user.id,
    username: user.username || "",
    profileImageUrl: user.profileImageUrl,
    fullName: user.fullName || "",
    createdAt: user.createdAt,
    bio: user.bio,
    location: user.location,
    website: user.website,
    email: user.emailAddresses?.[0]?.emailAddress,
    likes: user.likes,
    likedById: user.likedById,
    followersCount: user.followersCount,
    followingCount: user.followingCount,
    isFollowing: user.isFollowing,
    birthday: user.birthday,
  };
};

const pluralRules = new Intl.PluralRules();

export function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}
