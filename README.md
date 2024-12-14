# Twitter Clone Web App

![Application Preview](https://files.catbox.moe/qyig66.png)

This is a **Twitter Clone Web Application** using Next.js 15 + TypeScript + Tailwind CSS, built with Prisma and MongoDB. The app replicates core functionalities of Twitter, including posting tweets, reposting, notifications, and more.

## 🚀 Features

- **User Authentication**: Secure login and signup system.
- **Tweet Management**: Create, edit, and delete tweets.
- **Repost Functionality**: Users can repost tweets, which appear chronologically.
- **Notifications**: Real-time notifications for user interactions.
- **Media Uploads**: Users can upload and display images with their posts.
- **Comments**: Users can comment on tweets to interact with others.
- **Follow System**: Follow and unfollow users to manage your feed.
- **Profile Management**: Update profile details like bio, avatar, cover photo and more.
- **Search Users**: Find and explore other users on the platform.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## 🛠️ Technologies

- **[Next.js 15 (App Router)](https://nextjs.org/)**: For server-side rendering and dynamic routing.
- **[Prisma](https://www.prisma.io/)**: Database ORM for working with **MongoDB**.
- **[MongoDB](https://www.mongodb.com/)**: NoSQL database for efficient data storage.
- **[Zustand](https://zustand-demo.pmnd.rs/)**: State management.
- **[Zod](https://zod.dev/)**: Schema validation.
- **[Pusher](https://pusher.com/)**: Real-time notifications and updates.
- **[React Hot Toast](https://react-hot-toast.com/)**: For displaying toast notifications.
- **[React Dropzone](https://react-dropzone.js.org/)**: File upload UI in profile update.
- **[React Icons](https://react-icons.github.io/react-icons/)**: Icon library for UI components.

# 💻️ Development

1. Clone the repository:

   ```bash
   git clone https://github.com/duypd1309/twitter-clone.git
   cd twitter-clone
   ```

2. Install `pnpm` if you don't have it:

   ```bash
   npm install -g pnpm
   ```

3. Install dependencies using pnpm:

   ```bash
   pnpm install
   ```

4. Set up environment variables:
   Create a `.env` file and provide the following:

   ```env
   DATABASE_URL=          # Connection string for MongoDB.
   SESSION_SECRET=        # Secret key for signing user sessions.

   PUSHER_APP_ID=         # Your Pusher app ID for real-time functionality.
   NEXT_PUBLIC_PUSHER_KEY=# Your Pusher public key for client-side use.
   PUSHER_SECRET=         # Your Pusher secret key for server-side communication.
   NEXT_PUBLIC_PUSHER_CLUSTER= # Your Pusher cluster region.
   ```

5. Push the Prisma schema to your database:

   ```bash
   pnpm prisma db push
   ```

6. Start the development server:
   ```bash
   pnpm dev
   ```

## 🌐 Deployment

This application is deployed to **Vercel**: [https://twitter-clone-beta-umber-77.vercel.app/](https://twitter-clone-beta-umber-77.vercel.app/).

For more details about deploying to Vercel, refer to [Vercel's documentation](https://vercel.com/docs).
