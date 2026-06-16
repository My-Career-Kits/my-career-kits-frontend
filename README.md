# MyCareerKits — Next.js 14 Frontend

A premium, dark-themed AI-powered career management platform built with Next.js 14 App Router.

## Features

- **AI Resume Builder** — Generate professional resumes with AI
- **Cover Letter Generator** — Create tailored cover letters for specific jobs
- **ATS Analyzer** — Get instant feedback on resume ATS compatibility
- **Job Search** — Search thousands of jobs across multiple countries
- **Premium Dark UI** — Sleek, modern interface with glassmorphism effects

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: TanStack React Query v5
- **HTTP Client**: Axios with 401 refresh interceptor
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **PDF Export**: html2pdf.js (client-side)
- **Icons**: Lucide React
- **Fonts**: Geist Sans + Geist Mono

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8000`

### Installation

```bash
# Copy environment variables
cp .env.local.example .env.local

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

## Project Structure

```
mycareerkit/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Auth pages (login, signup, etc.)
│   │   ├── (dashboard)/     # Protected dashboard pages
│   │   ├── layout.tsx       # Root layout with providers
│   │   ├── page.tsx         # Landing page
│   │   ├── not-found.tsx    # 404 page
│   │   └── error.tsx        # Global error boundary
│   ├── components/
│   │   ├── layout/          # Sidebar, Topbar, Footer
│   │   ├── resume/          # Resume-specific components
│   │   ├── cover-letter/    # Cover letter components
│   │   ├── jobs/            # Job search components
│   │   ├── dashboard/       # Dashboard widgets
│   │   └── shared/          # Reusable shared components
│   ├── hooks/               # TanStack Query hooks
│   ├── lib/                 # Axios instance + query client
│   ├── providers/           # Auth & Query providers
│   ├── types/               # TypeScript interfaces
│   └── config/              # Footer configuration JSON
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── .env.local.example
```

## Key Implementation Details

### Authentication
- Cookie-based JWT (httpOnly cookies set by backend)
- 401 interceptor with token refresh queue
- Auth state via React Context (no localStorage tokens)
- Protected routes redirect unauthenticated users

### Caching Strategy
- React Query in-memory cache (no localStorage)
- `staleTime: 0` for resumes/cover letters (always fresh)
- `staleTime: 2min` for job search (rate limit protection)
- `staleTime: 5min` for user settings (rarely changes)
- Optimistic deletes with rollback on error
- Hover prefetching on list cards

### AI Processing
- Multi-stage animated indicators for all AI operations
- Cycling stage messages every 2.5s with progress bar
- No `router.push()` after generation — inline preview

### Error Handling
- `parseBackendError()` utility for consistent error messages
- Field-level form errors mapped from backend
- Network offline detection
- Friendly 404 page (no auto-redirect)

## API Contract

The frontend expects a Django REST backend with these endpoints:

### Auth (`/api/user/`)
- `POST /signup/` — Register new user
- `POST /login/` — Authenticate
- `POST /logout/` — Sign out
- `GET /me/` — Get current user
- `POST /refresh/` — Refresh JWT token
- `PATCH /changepassword/` — Change password
- `POST /send-reset-password-email/` — Request reset
- `POST /reset-password/<uid>/<token>/` — Confirm reset

### Resumes (`/api/resume/`)
- `GET /` — List resumes
- `POST /generate/` — AI generate resume
- `GET /<uuid>/` — Resume detail
- `PATCH /<uuid>/` — Update resume
- `DELETE /<uuid>/` — Delete resume
- `GET /analysis/<uuid>/` — Get analysis
- `POST /analysis/<uuid>/` — Run analysis

### Cover Letters (`/api/coverletter/`)
- `GET /` — List cover letters
- `POST /generate/` — AI generate cover letter
- `GET /<uuid>/` — Cover letter detail
- `PUT /<uuid>/` — Update cover letter
- `DELETE /<uuid>/` — Delete cover letter
- `GET /analysis/<uuid>/` — Get analysis
- `POST /analysis/<uuid>/` — Run analysis

### Jobs (`/api/jobs/`)
- `GET /?keywords=&location=` — Search jobs

## License

© 2025 MyCareerKits. A product of Shenmibox Ltd — Registered in England & Wales.
