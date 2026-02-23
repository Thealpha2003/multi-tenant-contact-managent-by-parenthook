import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { API_BASE } from "../config";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

function ContactList({
  contacts,
  selectedContactId,
  setSelectedContact,
  onContactAdded,
  loading,
}) {
  const { activeTenantId } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const addContact = async () => {
    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();

    if (!trimmedName) {
      setSubmitError("Name is required");
      return;
    }
    if (!trimmedEmail) {
      setSubmitError("Email is required");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setSubmitError("Please enter a valid email address");
      return;
    }

    setSubmitError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/tenants/${activeTenantId}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to add contact");
      }

      const newContact = await res.json();
      setName("");
      setEmail("");
      setShowForm(false);
      onContactAdded?.(newContact);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Contacts</h2>
        <button onClick={() => setShowForm(!showForm)}>
          + Add
        </button>
      </div>

      {showForm && (
        <div className="form">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSubmitError(null);
            }}
            disabled={submitting}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSubmitError(null);
            }}
            disabled={submitting}
          />
          {submitError && <p className="form-error">{submitError}</p>}
          <button onClick={addContact} disabled={submitting}>
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading contacts…</p>
      ) : contacts.length === 0 ? (
        <p>No contacts found</p>
      ) : (
        contacts.map((contact) => (
          <div
            key={contact.id}
            className={`contact-item ${
              selectedContactId === contact.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              setSelectedContact(contact.id)
            }
          >
            {contact.name}
          </div>
        ))
      )}
    </div>
  );
}

export default ContactList;
