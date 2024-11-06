import EditProfileModal from "@/components/profile/edit-profile-modal";
import { getCurrentSession, getUserByEmailOrUsername } from "@/lib/dal";
import { redirect } from "next/navigation";

// For soft navigation to the edit profile page
export default async function InterceptedPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // Check current logged in user === request edit profile user
  const session = await getCurrentSession();
  const username = (await params).username;
  if (session?.username === username) {
    const user = await getUserByEmailOrUsername(username, {
      name: true,
      username: true,
      bio: true,
      profileImage: true,
      coverImage: true,
    });
    if (user) return <EditProfileModal user={user} />;
  }

  redirect(`/${username}`);
}
