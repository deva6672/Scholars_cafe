# ☕ The Scholars Cafe — AI Chatbot

A production-ready AI chatbot & demo website for **The Scholars Cafe** (Ameenpur, Hyderabad), built to be shown to the cafe owner as a real business product — not a college project.

Includes:
- 🎨 A colorful, modern **demo cafe website** with an embedded floating chat widget
- 🤖 An **AI chatbot** (powered by Claude) that only answers from real, owner-approved cafe data — never invents menu items, prices, hours, or policies
- 🛠️ A password-protected **Admin Panel** so the owner can update menu, prices, hours, offers, FAQs and contact info without touching code
- 🔒 A secure Node.js/Express backend that keeps your API key server-side
- 🌐 An architecture ready to plug into WhatsApp, Instagram, Google Maps, online ordering, and a real database later

---

## 1. Project Structure

```
scholars-cafe-chatbot/
├── backend/
│   ├── data/cafeData.json        # Cafe knowledge base (the "database" for now)
│   ├── middleware/                # Auth + input validation
│   ├── routes/                    # /api/chat, /api/admin, /api/cafe-info
│   ├── services/                  # Anthropic API calls + data read/write
│   ├── utils/systemPrompt.js      # The chatbot's persona & grounding rules
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/            # LandingPage, ChatWidget, QuickReplies, etc.
│   │   ├── admin/                 # Admin login + dashboard
│   │   ├── api.js                 # All API calls to the backend
│   │   ├── App.jsx, main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── .env.example
├── DEPLOYMENT.md
├── BUSINESS_PROPOSAL.md
└── .gitignore
```

---

## 2. How It Works (Architecture)

```
Customer ──> Chat widget (React) ──> Backend API (Express) ──> Claude (Anthropic API)
                                            │
                                            ▼
                                  cafeData.json (menu, hours,
                                  contact, FAQs, offers)
                                            ▲
                                            │
                          Admin Panel (React, JWT-protected) ──> Cafe Owner
```

- The **frontend never talks to Claude directly** — your Anthropic API key lives only on the backend server, in an environment variable.
- Every chatbot answer is grounded in `cafeData.json`. The system prompt (see `backend/utils/systemPrompt.js`) explicitly instructs Claude to **never invent** menu items, prices, timings, or policies, and to tell the customer to contact the cafe when information isn't available.
- The Admin Panel edits the same `cafeData.json` through a protected API — so what the owner types is exactly what the bot says.

---

## 3. Local Setup

### Prerequisites
- Node.js 18+
- An Anthropic API key (https://console.anthropic.com/)

### Backend

```bash
cd backend
cp .env.example .env
# open .env and set:
#   ANTHROPIC_API_KEY=sk-ant-xxxxx
#   ADMIN_USERNAME / ADMIN_PASSWORD (choose your own)
#   JWT_SECRET (any long random string)
npm install
npm run dev
```

Backend runs on `http://localhost:5001` by default.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. Open it in your browser — you'll see the cafe landing page with the chat bubble in the bottom-right corner.

### Admin Panel

Visit `http://localhost:5173/admin`, log in with the `ADMIN_USERNAME` / `ADMIN_PASSWORD` you set in `backend/.env`, and update hours, contact info, offers, FAQs, and the menu — no code edits required.

---

## 4. Important: Replace Sample Data Before Going Live

`backend/data/cafeData.json` ships with:
- **Real, confirmed info**: address, plus code, rating (4.4/5, 305 reviews), service types (dine-in, drive-through, no-contact delivery), and known dish names.
- **Placeholder info** clearly marked `PLACEHOLDER-UPDATE-IN-ADMIN` (phone, email, socials) and **sample prices** clearly marked `isSamplePrice: true` for demo purposes.

**Before showing this to real customers**, use the Admin Panel to enter the cafe's real phone number, email, exact hours, and confirmed prices. The chatbot is designed to never present unconfirmed information as fact — but the demo data should still be replaced with the owner's real details.

---

## 5. Security Practices Used

- API key stored only in backend `.env`, never sent to the browser
- Helmet for HTTP security headers
- CORS restricted to your configured frontend URL(s)
- Rate limiting on all API routes, with a stricter limit on `/api/chat`
- Input validation & length limits on all incoming requests
- Admin routes protected with JWT + constant-time password comparison
- `.env` files excluded from Git via `.gitignore`

---

## 6. Extending This Project (Roadmap)

The codebase is intentionally modular so you can plug in more channels later:

| Channel | How to add it |
|---|---|
| **WhatsApp** | Use the WhatsApp Business Cloud API (Meta) or Twilio; forward incoming messages to the same `getChatResponse()` function in `backend/services/aiService.js`. |
| **Instagram DMs** | Meta's Messenger Platform API works similarly — same backend logic, new webhook route. |
| **Website widget elsewhere** | The `ChatWidget.jsx` component is self-contained; embed it (or a compiled script version) on any website. |
| **Google Maps** | Already linked via `address.googleMapsUrl`; can later integrate the Places API for live reviews/photos. |
| **Online ordering** | Add real Swiggy/Zomato/website links in `services.onlineOrderingLinks` in `cafeData.json`, and mention them in the system prompt. |
| **Real database** | Replace the functions in `backend/services/dataService.js` with calls to MongoDB/PostgreSQL/Firebase — nothing else in the app needs to change. |

---

## 7. Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Backend**: Node.js, Express
- **AI**: Anthropic Claude API (`@anthropic-ai/sdk`)
- **Auth**: JWT for admin sessions
- **Styling**: Hand-written CSS (no framework lock-in), custom cafe-themed design tokens

See `DEPLOYMENT.md` for hosting instructions and `BUSINESS_PROPOSAL.md` for how to pitch and price this for The Scholars Cafe and other restaurants.
