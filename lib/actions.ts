"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import {
  getCurrentSession,
  getPostById,
  getUserByEmailOrUsername,
  getUserById,
} from "./dal";
import prisma from "./db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "./session";
import Pusher from "pusher";

const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

const SignupFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  name: z.string().min(2, { message: "Be at least 2 characters long" }).trim(),
  username: z
    .string()
    .min(5, { message: "Be at least 5 characters long" })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

const SigninFormSchema = z.object({
  identifier: z.string().email().or(z.string().min(5)),
  password: z.string().min(8),
});

const updateProfileFormSchema = z.object({
  name: z.string().min(2, { message: "Be at least 2 characters long" }).trim(),
  username: z
    .string()
    .min(5, { message: "Be at least 5 characters long" })
    .trim(),
  bio: z.string().trim().optional(),
});

const createPostFormSchema = z.object({
  body: z.string().trim().min(1),
});

const createCommentFormSchema = z.object({
  body: z.string().trim().min(1),
});

export async function signup(prevState: unknown, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Prepare data for insertion into the database
  const { email, name, username } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

  // Create user in database
  try {
    await prisma.user.create({
      data: {
        email: email,
        name: name,
        username: username,
        hashedPassword: hashedPassword,
      },
    });
  } catch (error) {
    return { message: error ?? "Database Error: Failed to Create Invoice." };
  }

  // Redirect
  redirect("/");
}

export async function signin(prevState: unknown, formData: FormData) {
  // Validate form fields before checking in database
  const validatedFields = SigninFormSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      message: "Please enter a valid email or username and password.",
    };
  }

  // Check user in database
  const { identifier, password } = validatedFields.data;
  const user = await getUserByEmailOrUsername(identifier, {
    id: true,
    hashedPassword: true,
  });
  if (!user) return { message: "User does not exist." };
  const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);

  if (passwordsMatch) {
    await createSession(user.id);
    redirect("/");
  }

  return { message: "Invalid credentials." };
}

export async function signout() {
  await deleteSession();
  revalidatePath("/");
  redirect("/");
}

export async function updateProfile(
  uploadedImage: { [key: string]: string | null },
  prevState: unknown,
  formData: FormData
) {
  // Validate form fields
  const validatedFields = updateProfileFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Get current user id from session
  const currentUserId = (await getCurrentSession())?.userId;

  if (!currentUserId)
    return { message: "Session Error: Cannot verify session." };

  // Check if username already exists in database except for current user
  const existingUser = await prisma.user.findFirst({
    where: {
      username: validatedFields.data.username,
      NOT: { id: currentUserId },
    },
  });

  if (existingUser)
    return {
      errors: {
        username: [
          "Username already exists.",
          "Please choose a different username",
        ],
      },
    };

  // Prepare data for updating the database
  const { name, username, bio } = validatedFields.data;
  try {
    await prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        name: name,
        username: username,
        bio: bio,
        profileImage: uploadedImage.profileImage,
        coverImage: uploadedImage.coverImage,
      },
    });
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Update Profile." };
  }

  return { success: true, username };
}

export async function createPost(
  userId: string,
  prevState: unknown,
  formData: FormData
) {
  // Validate form fields
  const validatedFields = createPostFormSchema.safeParse({
    body: formData.get("body"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      message: "Please enter content for your tweet.",
    };
  }

  // Create post and insert into the database
  try {
    await prisma.post.create({
      data: {
        body: validatedFields.data.body,
        userId: userId,
      },
    });
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Create Post." };
  }

  return { success: true };
}

export async function followUser(userId: string) {
  // Get current user id from session
  const currentUserId = (await getCurrentSession())?.userId;

  if (!currentUserId) redirect("/login");

  // Get current user
  const user = await getUserById(currentUserId);

  if (!user)
    return {
      success: false,
      message: "Database Error: Current User not found.",
    };

  const updatedFollowingIds = [...user.followingIds];
  // Update following list of current user
  if (updatedFollowingIds.includes(userId)) {
    return { success: false, message: "Already following user." };
  } else {
    updatedFollowingIds.push(userId);
  }

  try {
    await prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        followingIds: updatedFollowingIds,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Database Error: Failed to Follow User.",
    };
  }

  // Get username to revalidate path
  let username;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
      },
    });

    if (!user) throw new Error("User not found.");

    username = user.username;
  } catch (error) {
    console.log(error);
    return {
      success: true,
      message:
        "Database Error: Successfully followed user, but failed to revalidate path.",
    };
  }

  // Create notification
  try {
    await createNotification("followed you.", userId, currentUserId);
  } catch (error) {
    console.log(error);
    console.log("Failed to create notification.");
  }

  // Trigger notification event
  try {
    await pusherServer.trigger(
      `notification-${userId}`,
      "new-notification",
      true
    );
    console.log("Notification sent successfully.");
  } catch (error) {
    console.error("Error sending notification:", error);
  }

  revalidatePath(`/${username}`);
  return { success: true, message: "Followed user successfully." };
}

export async function unfollowUser(userId: string) {
  // Get current user id from session
  const currentUserId = (await getCurrentSession())?.userId;

  if (!currentUserId)
    return { success: false, message: "Session Error: Cannot verify session." };

  // Get current user
  const currentUser = await getUserById(currentUserId);

  if (!currentUser)
    return {
      success: false,
      message: "Database Error: Current User not found.",
    };

  let updatedFollowingIds = [...currentUser.followingIds];
  // Update following list of current user
  if (!updatedFollowingIds.includes(userId)) {
    return { success: false, message: "Already not following user." };
  } else {
    updatedFollowingIds = updatedFollowingIds.filter(
      (followingId) => followingId !== userId
    );
  }

  try {
    await prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        followingIds: updatedFollowingIds,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Database Error: Failed to Unfollow User.",
    };
  }

  // Get username to revalidate path
  let username;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
      },
    });

    if (!user) throw new Error("User not found.");

    username = user.username;
  } catch (error) {
    console.log(error);
    return {
      success: true,
      message:
        "Database Error: Successfully unfollowed user, but failed to revalidate path.",
    };
  }

  revalidatePath(`/${username}`);
  return { success: true, message: "Unfollowed user successfully." };
}

export async function likePost(postId: string) {
  // Get current user id from session
  const currentUserId = (await getCurrentSession())?.userId;

  if (!currentUserId) redirect("/login");

  // Get post
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post)
    return {
      success: false,
      message: "Database Error: Post not found.",
    };

  const updatedLikeIds = [...post.likeIds];
  // Update likeIds of post
  if (updatedLikeIds.includes(currentUserId)) {
    return { success: false, message: "Already liked post." };
  } else {
    updatedLikeIds.push(currentUserId);
  }

  // Save to database
  try {
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likeIds: updatedLikeIds,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Database Error: Failed to like post.",
    };
  }

  // Create notification
  try {
    await createNotification("liked your tweet.", post.userId, currentUserId);
  } catch (error) {
    console.log(error);
    console.log("Failed to create notification.");
  }

  // Trigger notification event
  try {
    await pusherServer.trigger(
      `notification-${post.userId}`,
      "new-notification",
      true
    );
    console.log("Notification sent successfully.");
  } catch (error) {
    console.error("Error sending notification:", error);
  }

  revalidatePath("/");
  return { success: true, message: "Liked post successfully." };
}

export async function unlikePost(postId: string) {
  // Get current user id from session
  const currentUserId = (await getCurrentSession())?.userId;

  if (!currentUserId)
    return { success: false, message: "Session Error: Cannot verify session." };

  // Get post
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!post)
    return { success: false, message: "Database Error: Post not found." };

  // Update likeIds of post
  let updatedLikeIds = [...post.likeIds];
  if (!updatedLikeIds.includes(currentUserId)) {
    return { success: false, message: "Already not liked post." };
  } else {
    updatedLikeIds = updatedLikeIds.filter(
      (likeId) => likeId !== currentUserId
    );
  }

  // Save to database
  try {
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likeIds: updatedLikeIds,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Database Error: Failed to unlike post.",
    };
  }

  revalidatePath("/");
  return { success: true, message: "Unliked post successfully." };
}

export async function createComment(
  postId: string,
  formState: unknown,
  formData: FormData
) {
  // Get current user id from session
  const currentUserId = (await getCurrentSession())?.userId;

  if (!currentUserId)
    return { success: false, message: "Session Error: Cannot verify session." };

  // Validate form fields
  const validatedFields = createCommentFormSchema.safeParse({
    body: formData.get("body"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      message: "Please enter content for your reply.",
    };
  }

  // Create post and insert into the database
  try {
    await prisma.comment.create({
      data: {
        body: validatedFields.data.body,
        userId: currentUserId,
        postId: postId,
      },
    });
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to tweet reply." };
  }

  // Create notification
  const post = await getPostById(postId);
  if (!post)
    return {
      sucess: true,
      message: "Database Error: Cannot fetch data to create notification.",
    };

  try {
    await createNotification(
      "replied to your tweet.",
      post.userId,
      currentUserId
    );
  } catch (error) {
    console.log(error);
    console.log("Failed to create notification.");
  }

  // Trigger notification event
  try {
    await pusherServer.trigger(
      `notification-${post.userId}`,
      "new-notification",
      true
    );
    console.log("Notification sent successfully.");
  } catch (error) {
    console.error("Error sending notification:", error);
  }

  return { success: true };
}

export async function deletePost(postId: string) {
  // Get current user id from session
  const currentUserId = (await getCurrentSession())?.userId;

  if (!currentUserId)
    return { message: "Session Error: Cannot verify session." };

  // Delete post in database
  try {
    await prisma.post.delete({
      where: {
        id: postId,
        userId: currentUserId,
      },
    });
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to delete post." };
  }

  return { success: true };
}

export async function createNotification(
  body: string,
  userId: string,
  senderId: string
) {
  if (userId === senderId) return;

  try {
    await prisma.notification.create({
      data: {
        body,
        userId,
        senderId,
      },
    });
  } catch (error) {
    console.log(error);
    console.log("Failed to create notification.");
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hasNotification: true,
      },
    });
  } catch (error) {
    console.log(error);
    console.log("Failed to update user notification.");
  }
}

export async function turnOffNotification(userId: string) {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hasNotification: false,
      },
    });
  } catch (error) {
    console.log(error);
    console.log("Failed to update user notification.");
  }
}

export async function deleteNotifications(userId: string) {
  try {
    await prisma.notification.deleteMany({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.log(error);
    console.log("Failed to delete notifications.");
  }

  revalidatePath("/notifications");
}
