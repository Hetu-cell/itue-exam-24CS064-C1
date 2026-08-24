# 🚀 FitZone Deployment & GitHub Sync Guide

## 📦 1. GitHub Repository Push
- **Local Git Repository**: Initialized with all code committed (`main` branch).
- **Target Repository**: `https://github.com/Hetu-cell/itue-exam-24CS064-C1`
- If Git Credential Manager prompts in Windows, approve browser login, or run:
```bash
git push -u origin main
```

---

## ☁️ 2. Backend Deployment on Render

1. **Sign in to Render**: [https://dashboard.render.com/](https://dashboard.render.com/)
2. Click **New +** ➔ **Web Service**.
3. Choose **Build and deploy from a Git repository** and select:
   `Hetu-cell/itue-exam-24CS064-C1`
4. Configure the Web Service settings:
   - **Name**: `fitzone-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Click **Advanced** ➔ **Add Environment Variable**:
   - `MONGO_URI`: `mongodb+srv://Hetu_db_user:Harikesh05@cluster0.uw36kbh.mongodb.net/fitzone?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: `fitzone_secret_key_2026_exam`
   - `PORT`: `5000`
6. Click **Create Web Service**.
   - Render will build and launch your backend API.
   - Note down your live backend URL (e.g. `https://fitzone-backend-xxxx.onrender.com`).

---

## 🌐 3. Frontend Deployment on Vercel

1. **Sign in to Vercel**: [https://vercel.com/](https://vercel.com/)
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository: `Hetu-cell/itue-exam-24CS064-C1`.
4. Configure Project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.
   - Vercel will build and deploy the React application with instant global CDN hosting.
   - `vercel.json` has already been added to handle SPA routing cleanly on page refreshes.
