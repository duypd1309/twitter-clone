"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TabsProps {
  contents: string[];
  initActiveContent: string;
}

export default function Tabs({ contents, initActiveContent }: TabsProps) {
  const [activeContent, setActiveContent] = useState<string>(initActiveContent);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleTabClick(content: string) {
    setActiveContent(content);
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("query", activeContent.replace(/\s+/g, "").toLowerCase());

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, replace, searchParams, activeContent]);

  return (
    <div className="flex flex-row items-center text-white border-b-[1px] border-neutral-800">
      {contents.map((content) => (
        <div
          key={content}
          onClick={() => handleTabClick(content)}
          className={`flex-1 px-5 py-3 cursor-pointer text-center ${
            activeContent === content
              ? "font-semibold border-b-[3px] border-sky-500"
              : ""
          }`}
        >
          {content}
        </div>
      ))}
    </div>
  );
}
