import React, { useEffect, useState } from "react";
import { fetchAdminData, updateAdminData } from "../api.js";

const TABS = ["Hours", "Contact", "Offers & FAQs", "Menu (Advanced)"];

export default function AdminDashboard({ token, onLogout }) {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }
  const [loading, setLoading] = useState(true);
  const [menuJsonDraft, setMenuJsonDraft] = useState("");
  const [faqJsonDraft, setFaqJsonDraft] = useState("");

  useEffect(() => {
    fetchAdminData(token)
      .then((d) => {
        setData(d);
        setMenuJsonDraft(JSON.stringify(d.menu, null, 2));
        setFaqJsonDraft(JSON.stringify(d.faqs, null, 2));
      })
      .catch((err) => {
        if (err.status === 401) onLogout();
        setStatus({ type: "error", message: "Could not load data: " + err.message });
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveUpdate(partial, successMsg) {
    setStatus(null);
    try {
      const res = await updateAdminData(token, partial);
      setData(res.data);
      setStatus({ type: "success", message: successMsg || "Saved successfully." });
    } catch (err) {
      setStatus({ type: "error", message: "Save failed: " + err.message });
    }
  }

  if (loading) return <div className="ad-loading">Loading admin panel…</div>;
  if (!data) return <div className="ad-loading">Could not load cafe data.</div>;

  return (
    <div className="ad-dashboard">
      <header className="ad-header">
        <div>
          <h1>☕ The Scholars Cafe — Admin Panel</h1>
          <p>Update your chatbot's knowledge instantly. No code changes needed.</p>
        </div>
        <button className="ad-logout" onClick={onLogout}>Log Out</button>
      </header>

      <nav className="ad-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`ad-tab ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      {status && (
        <div className={`ad-status ad-status-${status.type}`}>{status.message}</div>
      )}

      <main className="ad-panel">
        {activeTab === "Hours" && <HoursTab data={data} onSave={saveUpdate} />}
        {activeTab === "Contact" && <ContactTab data={data} onSave={saveUpdate} />}
        {activeTab === "Offers & FAQs" && (
          <OffersFaqsTab
            data={data}
            faqJsonDraft={faqJsonDraft}
            setFaqJsonDraft={setFaqJsonDraft}
            onSave={saveUpdate}
          />
        )}
        {activeTab === "Menu (Advanced)" && (
          <MenuTab
            menuJsonDraft={menuJsonDraft}
            setMenuJsonDraft={setMenuJsonDraft}
            onSave={saveUpdate}
          />
        )}
      </main>
    </div>
  );
}

function HoursTab({ data, onSave }) {
  const [hours, setHours] = useState(data.hours);
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  return (
    <div className="ad-card">
      <h2>Opening Hours</h2>
      <p className="ad-hint">Format example: "8:00 AM - 11:00 PM". Leave blank + write "Closed" if closed that day.</p>
      <div className="ad-grid-2">
        {days.map((day) => (
          <label key={day}>
            {day[0].toUpperCase() + day.slice(1)}
            <input
              value={hours[day] || ""}
              onChange={(e) => setHours({ ...hours, [day]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <label>
        Internal note (not shown to customers)
        <textarea
          rows={2}
          value={hours.note || ""}
          onChange={(e) => setHours({ ...hours, note: e.target.value })}
        />
      </label>
      <button className="ad-save" onClick={() => onSave({ hours }, "Hours updated.")}>
        Save Hours
      </button>
    </div>
  );
}

function ContactTab({ data, onSave }) {
  const [contact, setContact] = useState(data.contact);
  const [address, setAddress] = useState(data.address);

  return (
    <div className="ad-card">
      <h2>Contact Details</h2>
      <div className="ad-grid-2">
        {Object.keys(contact).map((key) => (
          <label key={key}>
            {key}
            <input
              value={contact[key]}
              onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
            />
          </label>
        ))}
      </div>

      <h2 style={{ marginTop: 26 }}>Address</h2>
      <div className="ad-grid-2">
        {Object.keys(address).map((key) => (
          <label key={key}>
            {key}
            <input
              value={address[key]}
              onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
            />
          </label>
        ))}
      </div>

      <button
        className="ad-save"
        onClick={() => onSave({ contact, address }, "Contact & address updated.")}
      >
        Save Contact Info
      </button>
    </div>
  );
}

function OffersFaqsTab({ data, faqJsonDraft, setFaqJsonDraft, onSave }) {
  const [offerNote, setOfferNote] = useState(data.offers?.note || "");
  const [offersList, setOffersList] = useState((data.offers?.active || []).join("\n"));

  function saveOffers() {
    const active = offersList.split("\n").map((s) => s.trim()).filter(Boolean);
    onSave({ offers: { note: offerNote, active } }, "Offers updated.");
  }

  function saveFaqs() {
    try {
      const parsed = JSON.parse(faqJsonDraft);
      onSave({ faqs: parsed }, "FAQs updated.");
    } catch (e) {
      alert("Invalid JSON in FAQs box — please fix formatting before saving.");
    }
  }

  return (
    <div className="ad-card">
      <h2>Current Offers</h2>
      <label>
        Note (internal, e.g. "confirm before publishing")
        <input value={offerNote} onChange={(e) => setOfferNote(e.target.value)} />
      </label>
      <label>
        Active offers (one per line)
        <textarea
          rows={4}
          value={offersList}
          onChange={(e) => setOffersList(e.target.value)}
          placeholder="e.g. 10% off on weekday breakfast combos"
        />
      </label>
      <button className="ad-save" onClick={saveOffers}>Save Offers</button>

      <h2 style={{ marginTop: 30 }}>FAQs (JSON editor)</h2>
      <p className="ad-hint">
        Each item needs "question" and "answer". Keep the JSON format valid.
      </p>
      <textarea
        className="ad-json-editor"
        rows={12}
        value={faqJsonDraft}
        onChange={(e) => setFaqJsonDraft(e.target.value)}
      />
      <button className="ad-save" onClick={saveFaqs}>Save FAQs</button>
    </div>
  );
}

function MenuTab({ menuJsonDraft, setMenuJsonDraft, onSave }) {
  function saveMenu() {
    try {
      const parsed = JSON.parse(menuJsonDraft);
      onSave({ menu: parsed }, "Menu updated.");
    } catch (e) {
      alert("Invalid JSON — please fix the formatting before saving.");
    }
  }

  return (
    <div className="ad-card">
      <h2>Menu (Advanced JSON editor)</h2>
      <p className="ad-hint">
        Each category needs "category" and an "items" array. Each item needs
        "name", "description", "price" (number or null), "veg" (true/false),
        and "popular" (true/false). Set "price" to null if not confirmed yet —
        the chatbot will tell customers to ask staff.
      </p>
      <textarea
        className="ad-json-editor"
        rows={22}
        value={menuJsonDraft}
        onChange={(e) => setMenuJsonDraft(e.target.value)}
      />
      <button className="ad-save" onClick={saveMenu}>Save Menu</button>
    </div>
  );
}
