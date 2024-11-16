import { getPosts, getPostsandRepostsOfUserIds } from "@/lib/dal";
import PostItem from "./post-item";
import { Comment, Post, Repost, User } from "@prisma/client";

interface PostFeedProps {
  userIds?: string[];
  currentUserId?: string;
  isOnProfilePage?: boolean;
}

type PostWithRepostData = Post & {
  user: User;
  comments: Comment[];
  reposts: Repost[];
  repostData?: {
    repostId: string;
    repostedAt: Date;
    repostedBy: string;
  } | null;
};

export default async function PostFeed({
  userIds,
  currentUserId,
}: PostFeedProps) {
  let posts: PostWithRepostData[] | null;
  if (userIds) posts = await getPostsandRepostsOfUserIds(userIds);
  else posts = await getPosts();

  return (
    <>
      {posts &&
        posts.map((post) => (
          <PostItem
            key={post.repostData ? post.repostData.repostId : post.id}
            data={post}
            currentUserId={currentUserId}
          />
        ))}
    </>
  );
}
