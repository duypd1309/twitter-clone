import FollowBar from "./follow-bar";
import Search from "./search";
import Sidebar from "./sidebar/sidebar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-black">
      <div className="container h-full mx-auto max-w-6xl">
        <div className="grid grid-cols-4 h-full">
          <Sidebar />
          <div className="col-span-3 lg:col-span-2 border-x-[1px] border-neutral-800">
            {children}
          </div>
          <div className="px-4 py-4 hidden lg:flex flex-col gap-6">
            <Search />
            <FollowBar />
          </div>
        </div>
      </div>
    </div>
  );
}
