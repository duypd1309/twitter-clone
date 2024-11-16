import Header from "@/components/header";
import CreatePostForm from "@/components/post/create-post-form";
import PostFeed from "@/components/post/post-feed";
import Welcome from "@/components/welcome";
import { getCurrentSession, getUserById } from "@/lib/dal";
import Tabs from "@/components/tabs";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getCurrentSession();

  if (!session?.userId) return <Welcome />;

  const user = await getUserById(session.userId, {
    id: true,
    profileImage: true,
    followingIds: true,
  });

  if (!user)
    return <Header label="Error: User not found. Please reload page." />;

  const query = (await searchParams).query;
  let postFeed;
  if (query === "following") {
    postFeed = (
      <PostFeed currentUserId={session.userId} userIds={user.followingIds} />
    );
  } else postFeed = <PostFeed currentUserId={session.userId} />;

  return (
    <>
      <Header label="Home" />
      <CreatePostForm user={user} />
      <Tabs
        contents={["For you", "Following"]}
        initActiveContent={query === "following" ? "Following" : "For you"}
      />
      {postFeed}
    </>
  );
}
