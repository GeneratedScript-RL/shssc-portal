# SHSSC Portal

The **SHSSC Portal** is a full-stack web application designed to manage the Senior High School Student Council's operations. Built with modern technologies, it provides features for event management, forums, voting, transparency, and more.

## Features

- **Home Dashboard**: Displays announcements, quick links, upcoming events, and satisfaction polls.
- **Events System**: Calendar view, event registration, and email reminders.
- **Polls and Voting**: Create polls, submit votes, and view results.
- **Forums**: Participate in discussions with real-time updates.
- **Transparency**: Financial summaries and resolutions.
- **Live Q&A**: Ask the council questions during live sessions.
- **Admin Panel**: Manage users, roles, committees, awards, and more.

## Tech Stack

- **Framework**: Next.js 14 with App Router and TypeScript.
- **Styling**: Tailwind CSS and shadcn/ui component library.
- **Database**: Supabase for authentication, storage, and real-time updates.
- **State Management**: Zustand.
- **Forms**: React Hook Form with Zod validation.
- **Rich Text**: TipTap editor.
- **Email**: Resend SDK for transactional emails.
- **Analytics**: Vercel Analytics.

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/shssc-portal.git
   ```
2. Navigate to the project directory:
   ```bash
   cd shssc-portal
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

## Deployment

Deploy the application on [Vercel](https://vercel.com/):

1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Set the environment variables in the Vercel dashboard.

## Folder Structure

```
shssc-portal/
├── app/
│   ├── (public)/
│   ├── (portal)/
│   ├── (profile)/
│   ├── (admin)/
│   ├── api/
│   └── layout.tsx
├── components/
├── hooks/
├── lib/
├── stores/
├── supabase/
├── types/
├── public/
├── middleware.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
