# Product Mission

## Pitch

Quiz App is a lightweight, type-safe quiz app that prioritizes simplicity—no logins, no accounts—so one person can build a quiz and another can immediately try it with instant feedback.

## Product Overview

This is a lightweight quiz application designed to demonstrate how users can create quizzes and take them in an engaging, straightforward way. The app focuses on simplicity: no logins, no accounts, just an easy flow where one person can build quizzes and another can immediately try them out.

Users can:

- Browse available quizzes.
- Create new quizzes with a title, description, and multiple single-choice questions (with exactly one correct answer).
- Take a quiz, select answers, and receive a clear summary showing their score and performance.

It’s built as a demo/productivity tool for anyone needing a quick and intuitive quiz setup—trainings, workshops, classrooms, or just fun challenges among friends.

## Mission of the Product

The mission of this product is to make knowledge sharing fun, fast, and accessible to everyone.

It aims to:

- Encourage learning through interactive quizzes.
- Empower users to create and share questions effortlessly.
- Provide immediate feedback that fosters curiosity and motivation.

No barriers, no friction—just an open space where creating and taking quizzes feels natural and engaging.

## Users

### Primary Customers

- Educators and instructors: Create and deliver formative assessments and practice exams.
- Bootcamps and training orgs: Check cohort understanding quickly between sessions.
- Hiring managers and recruiters: Screen candidates with short knowledge checks.

### User Personas

**Instructor Ivy** (28–55 years old)
- **Role:** Instructor / Coach
- **Context:** Runs small cohorts; needs quick assessments without adopting a full LMS.
- **Pain Points:** Heavy LMS tools, time-consuming quiz creation, manual grading.
- **Goals:** Build quizzes fast, auto-grade reliably, share simply.

**Learner Leo** (18–45 years old)
- **Role:** Student / Candidate
- **Context:** Uses mobile/desktop for short quizzes; needs clarity and speed.
- **Pain Points:** Confusing UX, slow pages, no immediate feedback.
- **Goals:** Clear interface, instant feedback, frictionless navigation.

## The Problem

### Authoring friction and validation overhead
Creating well-structured quizzes with per-question validation is slow. Manual checks lead to errors and rework, costing hours per week across cohorts.

**Our Solution:** In-UI validation and server-side checks ensure exactly one correct choice per question and catch issues early.

### Manual grading and delayed feedback
Without built-in grading, instructors spend time scoring and learners wait for results, lowering engagement and slowing iteration.

**Our Solution:** Automatic grading with per-question correctness and a summary score returned immediately on submit.

### Heavyweight or locked-in alternatives
Many solutions require adopting a full LMS or vendor account, leading to setup overhead and lock-in.

**Our Solution:** A minimal, self-hostable stack with a clear REST API and SQLite persistence keeps things simple and portable.

## Differentiators

### End-to-end type-safety with shared models
Unlike ad-hoc REST integrations, we share TypeScript types across frontend and backend, reducing integration bugs and speeding iteration.

### Lightweight, self-hostable architecture
Unlike complex LMS platforms, the app runs on Node.js + SQLite with minimal dependencies, resulting in low cost and easy local/edge deployment.

### Fast developer and user experience
Vite + React enables fast HMR for developers and a snappy UI for users, improving build times and time-to-interaction.

## Technical Specification

- Frontend: React (with Vite + TypeScript) for a modern, responsive, and fast UI.
- Backend: Express (TypeScript) providing REST APIs.
- Database: SQLite, ensuring lightweight, portable, and easy-to-bootstrap storage.
- Shared Types: TypeScript shared package for strong type safety across frontend and backend.

## Key Features

### Core Features

- **Quiz authoring and validation:** Create quizzes with questions and choices; enforce exactly one correct answer per question. (implemented)
- **Take quiz + instant grading:** Submit answers and receive total score and per-question correctness. (implemented)
- **SQLite persistence:** Durable storage with a clear schema and foreign keys. (implemented)
- **Typed REST API:** Typed contracts between FE/BE via shared TypeScript models. (implemented)
- **Seed script:** Demo quiz seeding for quick start and testing. (implemented)

## Product Overview (Future Vision)

The quiz app is a lightweight platform for creating and taking quizzes with ease. Right now, users can create quizzes, add multiple single-choice questions, and take them with immediate feedback.

In the future, the app will evolve into a more engaging experience with features like:

- Naming yourself when taking a quiz, so results can be tied to a participant.
- A ranking page to compare performance across attempts.
- Difficulty levels on quizzes to better tailor the challenge.

This ensures the app scales from a simple demo into a more playful and competitive learning environment.

## Mission of the Product (Future Goals)

Our mission is to make learning and knowledge sharing engaging, interactive, and motivating. By enabling users to easily create quizzes, test themselves, and share results, we foster both fun and curiosity.

Looking ahead, the mission expands into friendly competition and personalization:

- Encouraging people to identify themselves in quizzes,
- Comparing results through rankings,
- Matching challenges with difficulty levels for all types of learners.

## Planned Features

### Participant Naming

- When starting a quiz, user must enter a display name.
- Submitted results store `{ participantName, score, quizId, timestamp }`.
- Ranking data will build on this.

### Ranking Page

- New page `/quiz/:id/ranking`.
- Displays participant scores for a specific quiz, sorted by highest score or fastest completion.
- Backend endpoint: `GET /api/quizzes/:id/ranking` → returns list of `{ participantName, score, takenAt }`.

### Difficulty Levels on Quizzes

- Add `difficulty` field on quizzes table (enum: `easy`, `medium`, `hard`).
- UI: allow setting difficulty during quiz creation.
- Quiz list shows difficulty badge.
- Optional filters: `/api/quizzes?difficulty=easy`.

### Collaboration Features

- **Shareable quiz links:** Distribute quizzes via URL for easy access. (planned)
- **Import/export (JSON):** Move quizzes between environments or back up content. (planned)
- **Basic analytics:** Aggregate results (accuracy per question, attempts) for insight. (planned)
- **Authentication and roles:** Protect authoring with sign-in and owner/admin roles. (planned)
- **Timers and randomization:** Optional time limits and shuffled questions. (planned)
