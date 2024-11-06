import Image from "next/image";
import Link from "next/link";

interface UserHeroProps {
  profileImage?: string | null;
  coverImage?: string | null;
}

export default function UserHero({ profileImage, coverImage }: UserHeroProps) {
  return (
    <div className="bg-neutral-700 h-44 relative">
      {coverImage && (
        <Image
          src={coverImage}
          alt="Cover Image"
          style={{ objectFit: "cover" }}
          fill
        />
      )}
      <div className="absolute w-36 h-36 -bottom-16 left-4">
        <Link href="/placeholder.jpg">
          <Image
            src={`${profileImage ? profileImage : "/placeholder.jpg"}`}
            alt="Profile Image"
            style={{
              objectFit: "cover",
              borderRadius: "100%",
              border: "3px solid black",
            }}
            fill
          />
        </Link>
      </div>
    </div>
  );
}
