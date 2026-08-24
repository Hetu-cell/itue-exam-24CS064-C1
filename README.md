# 🏋️ FitZone Gym & Class Booking Management System

A full-stack fitness management system built with **React 18 + Vite** on the frontend, **Node.js + Express REST API** on the backend, and **MongoDB Atlas** for cloud database persistence.

---

## 🌟 Key Features

- **Split-Screen Authentication**: Beautiful 100vh split-screen with rotating gym showcases, quotes, and role-based registration (`Member` vs `Trainer`).
- **Strict Role Architecture**:
  - **Member**: Tier-based class booking quotas (Basic: 1 Slot, Premium: 3 Slots, Platinum: Unlimited).
  - **Trainer**: Dedicated **Trainer Portal** with 1-click availability toggles (`Available` <-> `Fully Booked`), live assigned member rosters, and search.
  - **Admin Panel**: Lazy-loaded master operations center with live KPI metrics, member directory, trainer management, and class ledgers.
- **Gym Knowledge Hub**: Public About Us page with facility specs & operating hours, and 6-card Fitness Blog.
- **REST API Middleware**: Global request logger `[METHOD] [PATH] [STATUS] [RESPONSE-TIME ms]`, JWT auth guard, and central error handling.

---

## 🚀 Local Development Setup

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## ☁️ Deployment Instructions

### 📦 Backend Deployment on Render (Web Service)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + -> Web Service**.
2. Connect your GitHub repository: `https://github.com/Hetu-cell/itue-exam-24CS064-C1`.
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add Environment Variables under **Environment**:
   - `MONGO_URI`: `mongodb+srv://Hetu_db_user:Harikesh05@cluster0.uw36kbh.mongodb.net/fitzone?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: `fitzone_secret_key_2026_exam`
   - `PORT`: `5000`
7. Click **Create Web Service**. Render will give you a live URL (e.g. `https://fitzone-backend.onrender.com`).

---

### 🌐 Frontend Deployment on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new) and import your GitHub repository.
2. Set **Root Directory**: `frontend`
3. Set **Framework Preset**: `Vite`
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`
6. Click **Deploy**. Vercel will deploy the responsive light-theme UI globally.
