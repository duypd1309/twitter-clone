import { signout } from "@/lib/actions";
import { getCurrentSession } from "@/lib/dal";
import { BiLogOut } from "react-icons/bi";

export async function SidebarSignOutButton() {
  const session = await getCurrentSession();

  if (!session?.isAuth) return null;

  return (
    <form action={signout}>
      <button type="submit" className="flex flex-row items-center gap-4 p-4">
        <BiLogOut size={24} color="white" />
        <p className="hidden lg:block text-white text-xl">Log out</p>
      </button>
    </form>
  );
}
