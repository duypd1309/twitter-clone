import { getPosts } from "@/lib/dal";
import PostItem from "./post-item";

interface PostFeedProps {
  userId?: string;
  currentUserId?: string;
}

export default async function PostFeed({
  userId,
  currentUserId,
}: PostFeedProps) {
  const posts = await getPosts(userId);
  return (
    <>
      {posts &&
        posts.map((post) => (
          <PostItem
            key={post.id}
            data={post}
            isLikedByCurrentUserId={
              currentUserId ? post.likeIds.includes(currentUserId) : false
            }
          />
        ))}
    </>
  );
}
