# Favorite Restaurants

Favorite Restaurants is a web application that allows users to save, manage, and explore their favorite restaurants. Built with Next.js, it offers a smooth and efficient user experience.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/) or any compatible database
- [Prisma](https://www.prisma.io/) ORM

### Installation

Clone the repository:

```bash
git clone https://github.com/MikeNguyen98/favorite-restaurants.git
cd favorite-restaurants
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Copy the example environment file and configure your settings:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set up your database connection and other required environment variables.

### Database Setup

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

- Users can add restaurants to their favorites list.
- View details of favorite restaurants.
- Manage and remove restaurants from the list.

## Building for Production

To build and start the application in production mode:

```bash
npm run build
npm run start
```

## Deployment

This application is deployed on **Vercel**. You can access it at:

[Favorite Restaurants](https://favorite-restaurants.vercel.app)

To deploy manually, use:

```bash
vercel
```

This application is automatically deployed on Vercel whenever changes are pushed to the main branch.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## License

This project is licensed under the MIT License.

