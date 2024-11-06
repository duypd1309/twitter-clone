import { getComments } from "@/lib/dal";
import CommentItem from "./comment-item";

interface CommentFeedProps {
  postId: string;
}

export default async function CommentFeed({ postId }: CommentFeedProps) {
  const comments = await getComments(postId);
  return (
    <>
      {comments &&
        comments.map((comment) => (
          <CommentItem key={comment.id} data={comment} />
        ))}
    </>
  );
}
