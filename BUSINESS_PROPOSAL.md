# Business Proposal Guide — Pitching & Pricing This Chatbot

Use this as your own cheat sheet when presenting to The Scholars Cafe owner, or when adapting this product for other restaurants and cafes.

## 1. How to Pitch It to The Scholars Cafe Owner

Lead with the business outcome, not the tech:
- "Customers can get instant answers about your menu, hours, and location 24/7 — even when your staff are busy."
- "It's available on your website right now, and can be added to WhatsApp and Instagram next — where most of your customers already are."
- "You can update the menu, prices, and hours yourself, anytime, in under a minute — no developer needed."
- "It only ever tells customers what you've approved. It will never make up a price or a dish that doesn't exist."

Demo flow that works well in person:
1. Open the live site on your phone — show the landing page looking sharp on mobile.
2. Tap the chat bubble, ask "What's popular here?" and "Do you have millet tiffins?"
3. Ask a Telugu-English mixed question to show it adapts naturally.
4. Open `/admin`, change something small live (e.g. an opening hour), then ask the chatbot again to show the update took effect instantly.
5. Close with the roadmap slide: WhatsApp + Instagram + online ordering, coming next.

## 2. Suggested Pricing Models

Pick whichever fits the relationship best — many agencies use a mix of #1 and #2.

**Option A — One-time setup + monthly hosting/maintenance**
- Setup fee: ₹8,000–₹25,000 (covers customization, branding, data entry, deployment)
- Monthly fee: ₹1,500–₹4,000/month (covers hosting, API usage, minor updates, support)

**Option B — Pure subscription (SaaS-style)**
- ₹2,500–₹6,000/month, all-inclusive, no setup fee — easier for small cafes to say yes to.
- Higher tiers for WhatsApp/Instagram integration, multiple locations, or online ordering sync.

**Option C — Per-feature add-ons**
- Base chatbot (website only): ₹2,000/month
- + WhatsApp integration: +₹1,500/month
- + Instagram integration: +₹1,000/month
- + Online ordering link-up: +₹1,500/month
- + Custom domain & branding: one-time ₹2,000–₹5,000

Anthropic API usage cost is small per conversation, but as you scale to many cafes, track usage and build it into your monthly fee with a healthy margin.

## 3. Customizing This for Other Restaurants

The whole product is data-driven, so a new client mostly means:

1. **Duplicate the project** (or better, run one shared backend with a `cafeId` and a data file/collection per client once you move to a real database).
2. **Replace `backend/data/cafeData.json`** with the new restaurant's real info: name, address, hours, menu, contact, ambience, FAQs.
3. **Update branding**: colors in `frontend/src/index.css` (`:root` variables), name/logo in `LandingPage.jsx` and `ChatWidget.jsx`, and the emoji/icon used for the avatar.
4. **Adjust the persona** in `backend/utils/systemPrompt.js` if the new restaurant has a different tone (e.g. fine dining vs. casual cafe vs. Telugu-first audience).
5. **Set new environment variables** (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `ANTHROPIC_API_KEY` if using separate keys) and deploy as a new instance, or add as a new tenant if you've built multi-tenant support.

Because the AI is instructed to only answer from the JSON data file, onboarding a new restaurant is mostly a data-entry exercise, not a rebuild — this is what makes the service scalable across many clients.

## 4. Ideas for Differentiating as You Scale

- Offer a "starter package" that includes filling in their menu data for them (many small cafes don't have it digitized).
- Add a simple analytics view later (most-asked questions, busiest chat hours) as a premium feature.
- Offer white-label branding so each cafe feels like it has its own custom-built assistant.
- Bundle in a QR code (linking to the chat) for table tents / receipts as a physical touchpoint.
