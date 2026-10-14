# HeartTone 🎵

> **Feel every beat.** Free, open-source music streaming platform with natural language search, AI-powered playlists, real-time shared listening rooms, and native Android support.

[![License: MIT](https://img.shields.io/badge/License-MIT-rose.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android-sp--green.svg)](#downloads--access)
[![Release](https://img.shields.io/badge/Release-v5.1.2-pink.svg)](https://github.com/arunkumarpalani47-sys/heart_tone/releases)

---

## 🌟 Overview

**HeartTone** is a modern full-stack music streaming platform engineered as an ad-free, subscription-free alternative to commercial streaming services. It combines intelligent natural language search, automated recommendation pipelines, LLM-powered playlist generation, real-time synchronized listening rooms (**HeartLink**), and personalized listening analytics (**HeartTone Wrapped**).

The application serves both modern web browsers and native Android devices via Capacitor, providing continuous background audio streaming, offline download playback, and cross-device sync.

---

## 📲 Downloads & Access

| Platform | Access Link | Requirement |
| :--- | :--- | :--- |
| **Web Application** | [hearttone.vercel.app](https://hearttone.vercel.app) *(or your deployed Vercel domain)* | Modern Web Browser |
| **Android Client** | [HeartTone.apk](frontend/public/HeartTone.apk) | Android 7.0+ (API 24+) |

---

## ✨ Core Features

### 1. 🔍 Instant Intent-Aware Search
- **Entity Relationship Graph**: Traverses relationships across Directors, Actors, Movies, Soundtracks, and Artists (e.g., *A.R. Rahman*, *Anirudh*, *Rajinikanth*, *Christopher Nolan*).
- **Natural Language Intent**: Understood queries such as `"latest anirudh hits"`, `"rainy evening tamil songs"`, `"gym workout beats"`, or `"trending songs"`.
- **Typo Tolerance & Fuzzy Search**: Fast client-side LRU cache + server ranker handles misspellings seamlessly under 100ms.

### 2. 🤖 AI Playlist Studio & Importer
- **Prompt-to-Playlist**: Uses open-weight LLMs via Groq Cloud SDK to generate themed playlists directly from natural language prompts.
- **Playlist Importer**: Parse and import playlists from Spotify, Apple Music, and YouTube Music links.

### 3. 👥 HeartLink — Real-Time Shared Listening
- **Synchronized Playback**: Listen together in real time over WebSockets (Socket.io). Track changes, playback status, and seek offsets stay in perfect lockstep across devices.
- **In-Session Chat**: Instant text messaging inside the shared listening room with unique 6-character room codes.

### 4. 📴 Offline Downloads & Playback
- **Local Storage Management**: Download tracks directly to your device for offline playback with auto-reconciliation.
- **Persistent Media Session**: Full lock-screen and notification controls on Android with background playback support.

### 5. 📊 HeartTone Wrapped
- Visual summary of your top tracks, top artists, listening minutes, and genre personality.

### 6. 🛠️ Admin Portal
- Accessible at `/admin` with master passcode security for managing feedback, replying to users, and broadcasting "What's New" release announcements.

---

## 🏗️ Architecture

HeartTone follows a decoupled client-server architecture:

```
┌──────────────────────────┐         ┌──────────────────────────┐
│      Web Client          │         │      Android APK         │
│  React 18 + TypeScript   │         │  Capacitor Native Bridge │
└────────────┬─────────────┘         └────────────┬─────────────┘
             │                                    │
             └───────────────┬────────────────────┘
                             │ REST API + Socket.io WebSockets
                             ▼
              ┌──────────────────────────────┐
              │   HeartTone Backend Engine   │
              │   Express 4 + Socket.io 4    │
              │                              │
              │  - 24/7 Active Keep-Alive    │
              │  - Search & Cache Warmup     │
              │  - HeartLink Session Hub     │
              │  - Telemetry & Analytics     │
              └──────┬────────┬────────┬─────┘
                     │        │        │
           ┌─────────▼┐   ┌───▼────┐  ┌▼──────────┐
           │ MongoDB  │   │ Upstash│  │ Groq Cloud│
           │ Atlas    │   │ Redis  │  │ LLM API   │
           └──────────┘   └────────┘  └───────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18.3, TypeScript 5.7, Vite 6.4, Tailwind CSS 3.4, Zustand 5, Framer Motion, Lucide Icons |
| **Mobile** | Capacitor 8.1, Android SDK (API 24+) |
| **Backend** | Node.js 20+, Express 4.21, Socket.io 4.8, TypeScript 5.7 |
| **Database** | MongoDB Atlas (Mongoose ORM), Upstash Redis |
| **AI Engine** | Groq Cloud SDK (`qwen/qwen3.8-27b`) |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- MongoDB Atlas database connection URI
- Groq Cloud API Key

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arunkumarpalani47-sys/heart_tone.git
   cd heart_tone
   ```

2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. **Start the development servers**:
   ```bash
   npm run dev
   ```
   * **Frontend**: `http://localhost:5173`
   * **Backend API**: `http://localhost:4000`
   * **Admin Panel**: `http://localhost:5173/admin`

---

## 🌐 Production Deployment

### Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com) pointing to the `backend/` folder.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Set environment variables: `PORT=4000`, `NODE_ENV=production`, `FRONTEND_URL`, `MONGODB_URI`, `JWT_SECRET`, `ADMIN_SECRET`, `GROQ_KEY_1`.
5. **24/7 Keep-Alive**: The backend includes an automated self-ping mechanism (`/health`). To guarantee zero sleep on Render's free tier, add a free HTTP monitor at [UptimeRobot.com](https://uptimerobot.com) targeting `https://<your-render-url>/health` every 10 minutes.

### Frontend (Vercel)
1. Connect your repository to [Vercel](https://vercel.com) and set root directory to `frontend`.
2. Framework Preset: **Vite**.
3. Add Environment Variable:
   * `VITE_BACKEND_URL`: `https://<your-render-url>.onrender.com`
4. Deploy!

---

## 👥 Authors & Credits

Crafted with love by **Arunkumar** & **Darshana**.

## 📄 License

Distributed under the [MIT License](LICENSE).
