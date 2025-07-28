# 💊 Medication Manager — Frontend

This is the frontend of the Medication Manager app — a user-friendly interface for managing medications, schedules, and activity logs. It is built with **React**, **TypeScript**, and **Tailwind CSS**, and communicates with a serverless backend via REST APIs.

---

## 🧱 Tech Stack

- **React** with `react-router-dom`
- **TypeScript**
- **Tailwind CSS** for styling
- **Vite** as the build tool
- **Jest** and **React Testing Library** for unit testing

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

Update this URL to point to your deployed backend if needed.

### 3. Run the App

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

---

## 🧪 Running Tests

```bash
npm test
```

> Make sure `jest`, `ts-jest`, `@testing-library/react`, and `@testing-library/jest-dom` are installed and configured (already done in this project).

---

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-based components
│   ├── api.ts              # API service functions
│   ├── App.tsx            # Main app entry with routes
│   ├── main.tsx           # React entry point
│   └── index.css          # Tailwind base styles
├── public/
├── tests/                 # Unit tests (optional structure)
├── vite.config.ts
└── jest.config.ts
```

---

## ✨ Features

- Create and manage users
- Add medications with daily, weekly, or monthly schedules
- Mark medications as taken
- View and reactivate inactive medications
- Beautiful UI with responsive design
- Unit tested components and pages

---

## 🛠 Dev Tips

- To simulate a different user, navigate to `/userId/calendar`
- Use the `Add User` page to create a user if none exists
- All data syncs with a backend via `VITE_API_URL`

---

## 📬 Feedback & Contribution

If you find bugs or have ideas for improvement, feel free to open an issue or PR!
