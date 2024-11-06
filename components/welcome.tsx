import Link from "next/link";

export default function Welcome() {
  return (
    <div className="px-5 py-2 mt-10">
      <h1 className="text-white text-2xl text-center mb-4 font-bold">
        Welcome to Twitter
      </h1>
      <div className="flex flex-row items-center justify-center gap-4">
        <Link
          className="text-white bg-sky-500 rounded-full px-4 py-2 hover:bg-opacity-90 transition"
          href="/login"
        >
          Login
        </Link>
        <Link
          className="text-white bg-sky-500 rounded-full px-4 py-2 hover:bg-opacity-90 transition"
          href="/register"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
