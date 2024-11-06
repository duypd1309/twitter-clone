"use client";

import { signup } from "@/lib/actions";
import { useActionState } from "react";

export default function RegisterForm() {
  const [formState, formAction, isPending] = useActionState(signup, undefined);

  const inputClasses =
    "w-full p-4 text-lg text-white bg-black border-2 border-neutral-800 rounded-md outline-none focus:border-sky-500 transition disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed";
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <input
          className={inputClasses}
          placeholder="Email"
          type="text"
          name="email"
          aria-describedby="email-error"
        />
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {formState?.errors?.email &&
            formState.errors.email.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      <div className="flex flex-col">
        <input
          className={inputClasses}
          placeholder="Name"
          type="text"
          name="name"
          aria-describedby="name-error"
        />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {formState?.errors?.name &&
            formState.errors.name.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      <div className="flex flex-col">
        <input
          className={inputClasses}
          placeholder="Username"
          type="text"
          name="username"
        />
        <div id="userName-error" aria-live="polite" aria-atomic="true">
          {formState?.errors?.username &&
            formState.errors.username.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      <div className="flex flex-col">
        <input
          className={inputClasses}
          placeholder="Password"
          type="password"
          name="password"
          aria-describedby="password-error"
        />
        <div id="password-error" aria-live="polite" aria-atomic="true">
          {formState?.errors?.password &&
            formState.errors.password.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      <button
        disabled={isPending}
        type="submit"
        className="bg-white rounded-full font-semibold px-5 py-3 mt-4 hover:opacity-80 transition disabled:bg-neutral-500 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        Register
      </button>
    </form>
  );
}
