# 🚀 AI Placement & Application Tracker

A full-stack, AI-powered placement management system built with **Next.js 16** and **PostgreSQL**. This application helps candidates and administrators efficiently manage job applications, track progress, and leverage AI for smarter hiring decisions.


## 🔗 Live Demo

* 🌐  **Live URL** : [https://ai-placement-tracker.vercel.app](https://ai-placement-tracker.vercel.app/)

## 👤 Demo Credentials

### Admin Account

- **Email**: `admin@test.com`
- **Password**: `123456`
- **Role**: Full system access

### Candidate Account

- **Email**: `candidate@test.com`
- **Password**: `123456`
- **Role**: Limited access (own data only)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation &amp; Setup](#-installation--setup)
- [Development](#-development)
- [Testing](#-testing)
- [Database](#-database)
- [API Endpoints](#-api-endpoints)
- [Demo Credentials](#-demo-credentials)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication & Authorization

- **JWT-based authentication** with secure session management
- **Role-based access control** (Admin & Candidate)
  - **Admin**: Full access to manage candidates, jobs, and applications
  - **Candidate**: Limited access (view own data only)
- Protected routes using middleware
- Password hashing with bcrypt

### 👥 Candidate Management

- Create, read, update, delete candidate profiles
- Store candidate skills and experience
- Resume upload support
- Search candidates by name/email

### 💼 Job Management

- Create and manage job openings
- Store job title, company, and description
- Organize jobs by company

### 📝 Application Tracking

- Track candidate applications with status updates
- Application status pipeline:
  - 📮 **Applied** → 📌 **Shortlisted** → 🎤 **Interview** → ✅ **Selected** / ❌ **Rejected**
- Add notes and comments on applications
- Filter applications by status

### 🤖 AI-Powered Features

- **AI Match Analysis**: Analyze compatibility between candidates and jobs
- **Match percentage** calculation
- **Missing skills** identification
- **Improvement suggestions** for candidates
- Integration with Google Gemini API

### 📊 Dashboard

- Overview metrics:
  - Total Candidates
  - Total Job Openings
  - Total Applications
  - Selected Candidates Count
- Recent applications display
- Status-based visualization

### 🎨 User Interface

- Clean and modern dashboard design
- Built with **Tailwind CSS** + **shadcn/ui**
- Fully responsive design (mobile + desktop)
- Loading states and empty states
- Accessible components (WCAG compliant)

### ⚡ Performance Optimizations

- Server-side rendering (SSR)
- Optimized API routes
- Efficient database queries with Prisma ORM
- Component-based architecture

---

## 🛠️ Tech Stack

| Layer                    | Technology                       |
| ------------------------ | -------------------------------- |
| **Frontend**       | Next.js 16, React 19, TypeScript |
| **Styling**        | Tailwind CSS, shadcn/ui          |
| **Backend**        | Next.js API Routes               |
| **Database**       | PostgreSQL + Prisma ORM          |
| **Authentication** | JWT + NextAuth                   |
| **Validation**     | Zod                              |
| **AI**             | Google Gemini API                |
| **Testing**        | Jest, React Testing Library      |
| **Deployment**     | Vercel                           |

---

## 📁 Project Structure

```
ai-placement-tracker/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   └── ai/                   # AI analysis endpoints
│   ├── auth/                     # Authentication logic
│   │   └── actions.ts            # Server actions for auth
│   ├── candidates/               # Candidate management pages
│   │   ├── actions.ts            # Server actions
│   │   ├── page.tsx              # Candidates list
│   │   ├── create/               # Create candidate
│   │   └── [id]/edit/            # Edit candidate
│   ├── jobs/                     # Job management pages
│   │   ├── actions.ts            # Server actions
│   │   ├── page.tsx              # Jobs list
│   │   ├── create/               # Create job
│   │   └── [id]/                 # Job details
│   ├── applications/             # Applications tracking
│   │   └── page.tsx              # Applications list
│   ├── dashboard/                # Admin dashboard
│   │   └── page.tsx              # Dashboard page
│   ├── components/               # Page components
│   └── layout.tsx                # Root layout
├── components/                   # Shared UI components
│   ├── Card.tsx                  # Card component
│   ├── Form.tsx                  # Form component
│   ├── Navbar.tsx                # Navigation bar
│   ├── Sidebar.tsx               # Sidebar navigation
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility functions
│   ├── ai.ts                     # AI integration logic
│   ├── prisma.ts                 # Prisma client
│   ├── security.ts               # Security utilities
│   ├── session.ts                # Session management
│   ├── server-data.ts            # Server data queries
│   ├── validation.ts             # Zod validation schemas
│   └── utils.ts                  # General utilities
├── prisma/                       # Database schema
│   ├── schema.prisma             # Database models
│   └── migrations/               # Database migrations
├── __tests__/                    # Test files
│   ├── app/                      # App tests
│   └── lib/                      # Library tests
├── public/                       # Static assets
├── jest.config.ts                # Jest configuration
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies

```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **PostgreSQL** database

### Step 1: Clone Repository

```bash
git clone https://github.com/ankit-agarwal-devx/ai-placement-tracker.git
cd ai-placement-tracker
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/placement_db"

# AI
GEMINI_API_KEY="your-google-gemini-api-key"

# Session
SESSION_SECRET="your-secret-key-for-sessions"
```

### Step 4: Setup Database

```bash
# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔧 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linter
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🧪 Testing

This project uses **Jest** and **React Testing Library** for testing.

### Test Structure

```
__tests__/
├── app/
│   └── components/           # Component tests
└── lib/                      # Library/utility tests
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Current Test Coverage

- ✅ Unit tests for server-side data helpers
- ✅ Component/integration tests for client UI flows
- ⚠️ E2E tests: Use Playwright or Cypress for full end-to-end coverage

---

## 💾 Database

### Models

#### User

```
- id (Primary Key)
- name
- email (Unique)
- password (hashed)
- role (ADMIN | STUDENT)
- createdAt
```

#### Candidate

```
- id (Primary Key)
- name
- email
- skills
- resume (URL/text)
- userId (Foreign Key → User)
- createdAt
```

#### Job

```
- id (Primary Key)
- title
- company
- description
- createdAt
```

#### Application

```
- id (Primary Key)
- status (APPLIED | SHORTLISTED | INTERVIEW | SELECTED | REJECTED)
- notes
- candidateId (Foreign Key → Candidate)
- jobId (Foreign Key → Job)
- userId (Foreign Key → User)
- createdAt
```

### Database Migrations

```bash
# Create a new migration after schema changes
npx prisma migrate dev --name your_migration_name

# Reset database (development only)
npx prisma migrate reset
```

---

## 🔌 API Endpoints

### AI Analysis

- `POST /api/ai` - Analyze candidate-job match

### Candidates (Server Actions in `app/candidates/actions.ts`)

- Get all candidates
- Get candidate by ID
- Create candidate
- Update candidate
- Delete candidate

### Jobs (Server Actions in `app/jobs/actions.ts`)

- Get all jobs
- Get job by ID
- Create job
- Update job
- Delete job

### Applications (Server Actions in `app/applications/actions.ts`)

- Get all applications
- Update application status
- Create application

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**

   ```bash
   git push origin main
   ```
2. **Import project to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
3. **Configure environment variables**

   - Add `DATABASE_URL` (PostgreSQL)
   - Add `GEMINI_API_KEY`
   - Add `SESSION_SECRET`
4. **Deploy**

   - Vercel auto-deploys on push to main branch

### Production Checklist

- [ ] Set secure environment variables
- [ ] Enable HTTPS
- [ ] Configure PostgreSQL in production
- [ ] Enable caching headers
- [ ] Test all features in production
- [ ] Setup database backups

---

## 🔒 Security

### Implemented Security Features

✅ **Password Hashing**: Bcrypt for secure password storage
✅ **JWT Authentication**: Secure token-based authentication
✅ **Input Validation**: Zod schemas for all inputs
✅ **SQL Injection Prevention**: Prisma ORM with parameterized queries
✅ **CORS Protection**: Configured API endpoints
✅ **Protected Routes**: Middleware-based route protection
✅ **Session Management**: Secure session handling
✅ **XSS Prevention**: React auto-escaping + sanitization

### Best Practices

- Keep `.env` in `.gitignore`
- Rotate `SESSION_SECRET` periodically
- Use HTTPS in production
- Keep dependencies updated: `npm audit fix`
- Validate all user inputs server-side

### Code Style

- Use TypeScript for type safety
- Follow Next.js best practices
- Format code with Prettier
- Write meaningful commit messages
- Add tests for new features

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Google Gemini API](https://ai.google.dev/)

---

**Made with ❤️ by Ankit**
