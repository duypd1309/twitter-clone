import Header from "@/components/header";
import CreatePostForm from "@/components/post/create-post-form";
import PostFeed from "@/components/post/post-feed";
import Welcome from "@/components/welcome";
import { getCurrentSession, getUserById } from "@/lib/dal";

export default async function HomePage() {
  const session = await getCurrentSession();

  if (!session?.userId) return <Welcome />;

  const user = await getUserById(session.userId, {
    id: true,
    profileImage: true,
  });

  return (
    <>
      <Header label="Home" />
      {user && <CreatePostForm user={user} />}
      <PostFeed currentUserId={session.userId} />
    </>
  );
}
