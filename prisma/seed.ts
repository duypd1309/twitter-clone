import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const users = [
    {
      name: "Alice",
      username: "alice123",
      bio: "Loves nature and hiking",
      email: "alice@example.com",
      hashedPassword: "Alice123!",
      profileImage: "https://example.com/alice.jpg",
      coverImage: "https://example.com/cover1.jpg",
      followingIds: [],
    },
    {
      name: "Bob",
      username: "bob_the_builder",
      bio: "Engineer and DIY enthusiast",
      email: "bob@example.com",
      hashedPassword: "Bob123!",
      profileImage: "https://example.com/bob.jpg",
      coverImage: "https://example.com/cover2.jpg",
      followingIds: [],
    },
    {
      name: "Carol",
      username: "carol_coder",
      bio: "Frontend developer",
      email: "carol@example.com",
      hashedPassword: "Carol123!",
      profileImage: "https://example.com/carol.jpg",
      coverImage: "https://example.com/cover3.jpg",
      followingIds: [],
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
