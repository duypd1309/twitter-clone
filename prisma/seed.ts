import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑 Xóa dữ liệu cũ...");
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.repost.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log("🌱 Tạo dữ liệu mẫu...");

  // Hash mật khẩu demo
  const passwordHash = await bcrypt.hash("password123!", 10);

  // User demo
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      username: "demouser",
      email: "demouser@example.com",
      hashedPassword: passwordHash,
      bio: "Đây là tài khoản demo ✨",
      profileImage: "https://placehold.co/100x100",
      coverImage: "https://placehold.co/600x200",
    },
  });

  // Post demo 1
  const post1 = await prisma.post.create({
    data: {
      body: "Xin chào 👋 đây là bài post đầu tiên!",
      userId: demoUser.id,
      images: [],
    },
  });

  // Post demo 2
  const post2 = await prisma.post.create({
    data: {
      body: "Ứng dụng Twitter Clone 🚀 đang chạy!",
      userId: demoUser.id,
      images: ["https://placehold.co/400x200"],
    },
  });

  // Comment demo
  await prisma.comment.create({
    data: {
      body: "Bình luận mẫu trên post đầu tiên",
      userId: demoUser.id,
      postId: post1.id,
    },
  });

  // Notification demo
  await prisma.notification.create({
    data: {
      body: "Bạn có thông báo mới 🎉",
      userId: demoUser.id,
      senderId: demoUser.id,
    },
  });

  // Repost demo
  await prisma.repost.create({
    data: {
      userId: demoUser.id,
      postId: post2.id,
    },
  });

  console.log("✅ Seed xong!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
