import React, { useEffect, useState } from "react";
import { fetchCafeInfo } from "../api.js";
import "./LandingPage.css";

export default function LandingPage() {
  const [cafe, setCafe] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCafeInfo()
      .then(setCafe)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="lp-nav-brand">
          <span className="lp-nav-icon">☕</span>
          <span>The Scholars Cafe</span>
        </div>
        <nav className="lp-nav-links">
          <a href="#menu">Menu</a>
          <a href="#ambience">Ambience</a>
          <a href="#location">Location</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="lp-hero">
        <div className="lp-hero-text">
          <span className="lp-eyebrow">Ameenpur · Hyderabad</span>
          <h1>
            Good food, <span className="lp-highlight">calm vibes</span>,
            room to think.
          </h1>
          <p>
            Dahi puri, dosas, biryani, filter coffee and specialty drinks —
            served in a spacious, relaxed space made for lingering. Dine-in,
            drive-through or no-contact delivery.
          </p>
          <div className="lp-hero-cta">
            <a href="#location" className="lp-btn lp-btn-primary">
              Get Directions
            </a>
            <a href="#menu" className="lp-btn lp-btn-ghost">
              View Menu
            </a>
          </div>
          <div className="lp-rating">
            <span className="lp-stars">★★★★☆</span>
            <strong>{cafe?.rating ?? "4.4"}</strong>
            <span className="lp-rating-sub">
              ({cafe?.reviewCount ?? 305} Google reviews)
            </span>
          </div>
        </div>
        <div className="lp-hero-art" aria-hidden="true">
          <div className="lp-cup">☕</div>
          <div className="lp-blob lp-blob-1" />
          <div className="lp-blob lp-blob-2" />
        </div>
      </section>

      <section className="lp-badges">
        <div className="lp-badge">🍽️ Dine-in</div>
        <div className="lp-badge">🚗 Drive-through</div>
        <div className="lp-badge">📦 No-contact Delivery</div>
        <div className="lp-badge">💺 Spacious Seating</div>
      </section>

      <section id="menu" className="lp-section">
        <h2>What people come back for</h2>
        <p className="lp-section-sub">
          A snapshot of our most-loved dishes — ask our chat assistant (bottom
          right) for the full menu and current prices.
        </p>
        <div className="lp-menu-grid">
          {(cafe?.popularDishes || [
            "Dahi Puri",
            "Pani Puri",
            "Pav Bhaji",
            "Masala Dosa",
            "Millet Tiffins",
            "Chicken Biryani",
            "Filter Coffee",
            "Masala Chai",
          ]).map((dish) => (
            <div className="lp-menu-card" key={dish}>
              <span className="lp-menu-dot" />
              {dish}
            </div>
          ))}
        </div>
      </section>

      <section id="ambience" className="lp-section lp-section-alt">
        <h2>Ambience</h2>
        <div className="lp-ambience-grid">
          {(cafe?.ambience || [
            "Spacious seating",
            "Calm, relaxed atmosphere",
            "Great for working or studying",
            "Friendly, attentive staff",
          ]).map((a) => (
            <div className="lp-ambience-item" key={a}>
              <span>✓</span> {a}
            </div>
          ))}
        </div>
      </section>

      <section id="location" className="lp-section">
        <h2>Find us</h2>
        <div className="lp-location-grid">
          <div className="lp-location-text">
            <p>
              {cafe?.address
                ? `${cafe.address.line1}, ${cafe.address.line2}, ${cafe.address.city}, ${cafe.address.state} ${cafe.address.pincode}`
                : "Plot No. 54/1, Road 7, Sri Vani Nagar, near Coca Cola Factory, Ganesh Nagar, Ameenpur, Hyderabad, Telangana 502033"}
            </p>
            <p className="lp-pluscode">
              Plus Code: {cafe?.address?.plusCode || "G8GV+92M"}
            </p>
            <a
              href={cafe?.address?.googleMapsUrl || "https://maps.google.com"}
              target="_blank"
              rel="noreferrer"
              className="lp-btn lp-btn-primary"
            >
              Open in Google Maps
            </a>
          </div>
          <div className="lp-map-placeholder">
            <span>🗺️ Map preview</span>
            <small>(Embed a live Google Map here once you have an API key)</small>
          </div>
        </div>
      </section>

      <footer id="contact" className="lp-footer">
        <div>
          <h3>The Scholars Cafe</h3>
          <p>Ask our chat assistant anytime — bottom right corner.</p>
        </div>
        <div className="lp-footer-links">
          <span>📞 Contact via chat for confirmed number</span>
          <span>✉️ Contact via chat for confirmed email</span>
        </div>
        {error && (
          <p className="lp-footer-note">
            (Live cafe data will appear here once the backend is running.)
          </p>
        )}
      </footer>
    </div>
  );
}
