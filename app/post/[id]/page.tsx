import CommentFeed from "@/components/comment/comment-feed";
import CommentForm from "@/components/comment/comment-form";
import Header from "@/components/header";
import PostItem from "@/components/post/post-item";
import { getCurrentSession, getPostById, getUserById } from "@/lib/dal";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUserId = (await getCurrentSession())?.userId;
  const postId = (await params).id;
  const post = await getPostById(postId);

  if (!post) return <Header showBackArror label="Tweet Not Found" />;
  if (!currentUserId) return <Header showBackArror label="Session Error." />;

  const currentUser = await getUserById(currentUserId, {
    profileImage: true,
  });
  return (
    <>
      <Header showBackArror label="Tweet" />
      <PostItem data={post} currentUserId={currentUserId} />
      <CommentForm
        postId={postId}
        userProfileImage={currentUser?.profileImage || "/placeholder.jpg"}
      />
      <CommentFeed postId={postId} />
    </>
  );
}
