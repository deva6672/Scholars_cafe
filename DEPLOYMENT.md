# Deployment Guide

This project has two independently deployable parts: **backend** (API) and **frontend** (website + chat widget + admin panel). Below is the simplest free/low-cost path.

## Recommended stack
- **Backend** → [Render](https://render.com) or [Railway](https://railway.app) (free tier available, easy env vars)
- **Frontend** → [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

---

## Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: The Scholars Cafe chatbot"
git branch -M main
git remote add origin https://github.com/<your-username>/scholars-cafe-chatbot.git
git push -u origin main
```

`.env` files are already excluded via `.gitignore` — never commit real API keys.

---

## Step 2 — Deploy the Backend (Render example)

1. Go to Render → **New Web Service** → connect your GitHub repo.
2. Set **Root Directory** to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables (Render dashboard → Environment):
   - `ANTHROPIC_API_KEY`
   - `CLAUDE_MODEL` (e.g. `claude-sonnet-5`)
   - `FRONTEND_URL` (your deployed frontend URL, added after Step 3)
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`
   - `RATE_LIMIT_WINDOW_MINUTES`, `RATE_LIMIT_MAX_REQUESTS`
6. Deploy. Note the backend URL, e.g. `https://scholars-cafe-api.onrender.com`.

> On Render's free tier, note the service may sleep after inactivity and take a few seconds to wake up on first request — fine for a demo, worth upgrading for production traffic.

---

## Step 3 — Deploy the Frontend (Vercel example)

1. Go to Vercel → **New Project** → import your GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: Vite.
4. Add environment variable:
   - `VITE_API_BASE_URL` = `https://scholars-cafe-api.onrender.com/api` (your backend URL from Step 2, with `/api` at the end)
5. Deploy. You'll get a URL like `https://scholars-cafe.vercel.app`.

---

## Step 4 — Connect them together

1. Go back to your Render backend environment variables and set:
   - `FRONTEND_URL=https://scholars-cafe.vercel.app`
2. Redeploy the backend so CORS allows requests from your live frontend.

---

## Step 5 — Verify

- Visit your frontend URL → the landing page and chat bubble should load.
- Click the chat bubble → send a test message like "What are your popular dishes?"
- Visit `https://scholars-cafe.vercel.app/admin` → log in with your admin credentials → confirm you can edit hours/contact/menu and see the change reflected in the chatbot's next reply.

---

## Custom Domain (optional, for the real client pitch)

Both Vercel and Render support custom domains for free (SSL included). Example: point `chat.thescholarscafe.com` (backend) and `www.thescholarscafe.com` (frontend) via your domain registrar's DNS settings, following each platform's "Custom Domain" instructions.

---

## Production Checklist Before Client Demo

- [ ] Replace all `PLACEHOLDER-UPDATE-IN-ADMIN` values with real contact info via the Admin Panel
- [ ] Confirm real menu prices with the owner and update via Admin Panel
- [ ] Confirm real opening hours and update via Admin Panel
- [ ] Set a strong, unique `ADMIN_PASSWORD` and `JWT_SECRET`
- [ ] Test the chatbot with a few Telugu-English mixed questions
- [ ] Test on an actual mobile phone (not just browser resize)
- [ ] Set up a custom domain if presenting as a finished product
