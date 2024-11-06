import { signin } from "@/lib/actions";
import { useActionState } from "react";

export default function LoginForm() {
  const [formState, formAction, isPending] = useActionState(signin, undefined);

  const inputClasses =
    "w-full p-4 text-lg text-white bg-black border-2 border-neutral-800 rounded-md outline-none focus:border-sky-500 transition disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed";
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input
        className={inputClasses}
        placeholder="Email or Username"
        type="text"
        name="identifier"
      />
      <input
        className={inputClasses}
        placeholder="Password"
        type="password"
        name="password"
      />
      <button
        disabled={isPending}
        type="submit"
        className="bg-white rounded-full font-semibold px-5 py-3 mt-4 hover:opacity-80 transition disabled:bg-neutral-500 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        Sign in
      </button>
      {formState?.message && (
        <p className="text-center text-red-500">{formState.message}</p>
      )}
    </form>
  );
}
