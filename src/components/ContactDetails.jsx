import { useState } from "react";
import { API_BASE } from "../config";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

function ContactDetails({ selectedContact, onContactUpdated, onContactDeleted }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const startEdit = () => {
    if (selectedContact) {
      setName(selectedContact.name);
      setEmail(selectedContact.email);
      setError(null);
      setEditing(true);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setError(null);
  };

  const saveEdit = async () => {
    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();

    if (!trimmedName) {
      setError("Name is required");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/contacts/${selectedContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update");
      }
      const updated = await res.json();
      onContactUpdated?.(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteContact = async () => {
    if (!selectedContact || !window.confirm(`Delete ${selectedContact.name}?`)) return;

    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/contacts/${selectedContact.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete");
      }
      onContactDeleted?.(selectedContact.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (!selectedContact) {
    return (
      <div className="right-panel empty-state">
        <div className="empty-icon">👤</div>
        <h2>Select a contact</h2>
        <p>Choose a contact from the list to view or edit details</p>
      </div>
    );
  }

  return (
    <div className="right-panel">
      <div className="detail-header">
        <h2>Contact Details</h2>
        {!editing ? (
          <div className="detail-actions">
            <button className="btn-secondary" onClick={startEdit}>
              Edit
            </button>
            <button
              className="btn-danger"
              onClick={deleteContact}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        ) : (
          <div className="detail-actions">
            <button className="btn-secondary" onClick={cancelEdit} disabled={saving}>
              Cancel
            </button>
            <button onClick={saveEdit} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      {editing ? (
        <div className="form">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
            placeholder="Full name"
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={saving}
            placeholder="email@example.com"
          />
        </div>
      ) : (
        <div className="detail-body">
          <div className="detail-row">
            <span className="detail-label">Name</span>
            <span className="detail-value">{selectedContact.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <a
              href={`mailto:${selectedContact.email}`}
              className="detail-value link"
            >
              {selectedContact.email}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactDetails;
