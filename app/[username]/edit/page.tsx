import Header from "@/components/header";
import PostFeed from "@/components/post/post-feed";
import UserBio from "@/components/profile/user-bio";
import UserHero from "@/components/profile/user-hero";
import {
  getFollowers,
  getUserByEmailOrUsername,
  getCurrentSession,
} from "@/lib/dal";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;
  const [user, followers, session] = await Promise.all([
    getUserByEmailOrUsername(username, {
      id: true,
      name: true,
      bio: true,
      profileImage: true,
      coverImage: true,
      createdAt: true,
      followingIds: true,
    }),
    getFollowers(username, { id: true }),
    getCurrentSession(),
  ]);

  if (!user?.name) return <Header showBackArror label="User Not Found" />;

  let isFollowedByCurrentUser;
  if (!followers || !session?.userId) isFollowedByCurrentUser = false;
  else
    isFollowedByCurrentUser = followers.some(
      (follower) => follower.id === session.userId
    );
  return (
    <>
      <Header showBackArror label={user.name} />
      <UserHero profileImage={user.profileImage} coverImage={user.coverImage} />
      <UserBio
        userId={user.id}
        username={username}
        name={user.name}
        bio={user.bio}
        createdAt={user.createdAt}
        followingIds={user.followingIds}
        followerCount={followers?.length || 0}
        isCurrentUser={session?.userId === user.id}
        isFollowedByCurrentUser={isFollowedByCurrentUser}
      />
      <PostFeed userId={user.id} currentUserId={session?.userId} />
    </>
  );
}
