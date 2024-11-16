import "server-only";

import prisma from "./db";
import { cookies } from "next/headers";
import { decrypt } from "./session";
import { cache } from "react";

export const getCurrentSession = cache(
  async (): Promise<{
    isAuth: true;
    userId: string;
    username?: string;
  } | null> => {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) return null;

    let username;

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: session.userId,
        },
      });

      username = user?.username;
    } catch (error) {
      console.log("Cannot fetch username for user");
      console.log(error);
    }

    return { isAuth: true, userId: session.userId as string, username };
  }
);

export async function getUserById(
  id: string,
  includeFields: { [key: string]: boolean } = {}
) {
  try {
    const selectFields =
      includeFields && Object.keys(includeFields).length > 0
        ? includeFields
        : undefined;
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      select: selectFields,
    });

    return user;
  } catch (error) {
    console.log("Error finding user:", error);
    return null;
  }
}

export async function getUserByEmailOrUsername(
  identifier: string,
  includeFields: { [key: string]: boolean } = {}
) {
  try {
    const selectFields =
      includeFields && Object.keys(includeFields).length > 0
        ? includeFields
        : undefined;
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
      select: selectFields,
    });

    return user;
  } catch (error) {
    console.log("Error finding user:", error);
    return null;
  }
}

export async function getUsersMatchingNameOrUsername(
  searchTerm: string,
  includeFields: { [key: string]: boolean } = {}
) {
  try {
    const selectFields =
      includeFields && Object.keys(includeFields).length > 0
        ? includeFields
        : undefined;

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      select: selectFields,
    });

    return users;
  } catch (error) {
    console.log("Error finding user:", error);
    return null;
  }
}

export async function getAllUsers(
  includeFields: { [key: string]: boolean } = {}
) {
  const selectFields =
    includeFields && Object.keys(includeFields).length > 0
      ? includeFields
      : undefined;
  try {
    const users = await prisma.user.findMany({
      select: selectFields,
    });

    return users;
  } catch (error) {
    console.log("Error finding users:", error);
    return null;
  }
}

export async function getFollowers(
  username: string,
  includeFields: { [key: string]: boolean } = {}
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });

    if (!user) return null;

    const selectFields =
      includeFields && Object.keys(includeFields).length > 0
        ? includeFields
        : undefined;

    const followers = await prisma.user.findMany({
      where: {
        followingIds: {
          has: user?.id,
        },
      },
      select: selectFields,
    });
    return followers;
  } catch (error) {
    console.log("Error getting follower count:", error);
    return null;
  }
}

export async function getPosts(userId?: string) {
  try {
    let posts;
    if (userId) {
      posts = await prisma.post.findMany({
        where: {
          userId,
        },
        include: {
          user: true,
          comments: true,
          reposts: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      posts = await prisma.post.findMany({
        include: {
          user: true,
          comments: true,
          reposts: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return posts;
  } catch (error) {
    console.log("Error getting posts:", error);
    return null;
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        comments: true,
        reposts: true,
      },
    });
    return post;
  } catch (error) {
    console.log("Error getting post by id:", error);
    return null;
  }
}

export async function getPostsandRepostsOfUserIds(userIds: string[]) {
  try {
    // Get posts and reposts of user including user and comments
    const posts = await prisma.post.findMany({
      where: {
        userId: { in: userIds },
      },
      include: {
        user: true,
        comments: true,
        reposts: true,
      },
    });

    const reposts = await prisma.repost.findMany({
      where: {
        userId: { in: userIds },
      },
      include: {
        post: {
          include: {
            user: true,
            comments: true,
            reposts: true,
          },
        },
        user: true,
      },
    });

    // Format posts and reposts to a unified format (Post type and "isRepost" field for distinguishing between posts and reposts)
    const formattedPosts = posts.map((post) => ({
      ...post,
      repostData: null,
    }));

    const formattedReposts = reposts.map((repost) => ({
      ...repost.post,
      repostData: {
        repostId: repost.id,
        repostedAt: repost.createdAt,
        repostedBy: repost.user.username,
      },
    }));

    // Merge posts and reposts into a single array
    const allPosts = [...formattedPosts, ...formattedReposts];

    const sortedPosts = allPosts.sort((a, b) => {
      const dateA = a.repostData ? a.repostData.repostedAt : a.createdAt;
      const dateB = b.repostData ? b.repostData.repostedAt : b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });

    return sortedPosts;
  } catch (error) {
    console.log("Error getting posts and reposts:", error);
    return null;
  }
}

export async function getComments(postId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return comments;
  } catch (error) {
    console.log("Error getting comments:", error);
    return null;
  }
}

export async function getNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return notifications;
  } catch (error) {
    console.log("Error getting notifications:", error);
    return null;
  }
}
