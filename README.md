# AI-Powered Quiz App - Frontend

## Overview
This is the Next.js-based frontend for an AI-powered quiz application, providing a professional UI for user authentication, quiz management, and result viewing. It integrates with the Django backend via REST APIs and uses Tailwind CSS for styling.

## How to Run the Project Locally

1. **Set Up Environment**:
   - Navigate to the `frontend/` directory.
   - Install Node.js (v18 or later recommended).

2. **Install Dependencies**:
   - Run: `npm install` to install all required packages, including `react-hot-toast` and `react-spinners`.

3. **Configure Environment Variables**:
   - Create a `.env.local` file in `frontend/` with:
NEXT_PUBLIC_API_BASE=http://localhost:8000
text- For production, update to your Render backend URL (e.g., `https://quizbackend-xxmv.onrender.com`).

4. **Run the Development Server**:
- Start the app: `npm run dev`.
- Access at `http://localhost:3000` and navigate to `/login`, `/dashboard`, or `/quiz/{id}`.

## Database Design Decisions
- **Reliance on Backend**: The frontend does not manage a local database; it consumes the backend's PostgreSQL schema (Neon.tech) via APIs.
- **State Management**: Uses React Context API for auth state (token) to maintain a lightweight client-side experience.
- **Rationale**: Centralized data on the backend ensures consistency; client-side state is minimal for performance.

## API Structure
- **Base URL**: Defined in `.env.local` (e.g., `http://localhost:8000`).
- **Endpoints Used**:
- `POST /api/register/`: Register user.
- `POST /api/login/`: Authenticate user.
- `GET /api/quizzes/`: Fetch user quizzes.
- `POST /api/quizzes/create/`: Create new quiz.
- `GET /api/quizzes/{id}/`: Load quiz questions.
- `POST /api/quizzes/{id}/submit/`: Submit quiz answers.
- `GET /api/results/`: Retrieve results.
- **Authentication**: JWT token passed in `Authorization` header.
- **Error Handling**: Uses `react-hot-toast` for user feedback on API failures.

## Challenges Faced and How They Were Solved
- **CORS Issues**: Initial cross-origin requests failed; resolved by configuring `corsheaders` in the backend and allowing frontend origins.
- **Responsive Design**: Basic UI was non-responsive; implemented Tailwind CSS grid and media queries for a professional layout.
- **API Integration**: Token management was inconsistent; fixed with a centralized `AuthContext`.
- **Loading States**: Missing feedback during API calls; added `react-spinners` for loading indicators.

## Features Implemented vs. Skipped
- **Implemented**:
- User login/register page with toggle.
- Dashboard for quiz creation and listing.
- Quiz-taking interface with progress bar.
- Results page with detailed table.
- Responsive design with single professional theme (blue accents).
- Reason: Delivered a complete MVP with a polished UI.
- **Skipped**:
- Multiple themes (e.g., dark mode, skipped to maintain simplicity).
- Real-time updates (requires WebSockets, deferred for future).
- User profile management (e.g., settings, skipped for MVP focus).
- Reason: Prioritized core functionality and professional design over additional features.

## Deployment
- **Platform**: Vercel (free tier).
- **Build Command**: `npm run build`.
- **Start Command**: `npm run start` (handled by Vercel).
- **Env Var**: `NEXT_PUBLIC_API_BASE` (set to backend URL).
- **Runtime**: Node.js 18.x.

**Repo Structure**:
- `app/`: Next.js pages (e.g., `login`, `dashboard`, `quiz`, `results`).
- `components/`: Reusable UI components (e.g., `Header`, `Footer`).
- `context/`: Auth context for state management.
- `public/`: Static assets.
- `README.md`: This file.

Notes