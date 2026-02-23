import { useState, useEffect, useCallback } from "react";
import TenantSidebar from "./components/TenantSidebar";
import ContactList from "./components/ContactList";
import ContactDetails from "./components/ContactDetails";
import { useAppStore } from "./store/useAppStore";
import { API_BASE } from "./config";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { activeTenantId, selectedContactId, setSelectedContact } = useAppStore();

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tenants/${activeTenantId}/contacts`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch contacts");
      }
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      const msg =
        err.message === "Failed to fetch"
          ? "Backend unreachable — run: cd backend && npm run dev"
          : err.message;
      setError(msg);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [activeTenantId]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  const displayError = error;

  return (
    <div className="dashboard">
      <TenantSidebar />

      <div className="main">
        <div className="topbar">
          <h1>Multi-Tenant Contact Manager</h1>
        </div>

        <div className="content">
          {displayError && (
            <div className="error-banner" role="alert">
              {displayError}
            </div>
          )}
          <div className="content-row">
            <ContactList
              contacts={loading ? [] : contacts}
              selectedContactId={selectedContactId}
              setSelectedContact={setSelectedContact}
              loading={loading}
              onContactAdded={(newContact) =>
                setContacts((prev) => [...prev, newContact])
              }
            />

            <ContactDetails
              selectedContact={selectedContact}
              onContactUpdated={(updated) =>
                setContacts((prev) =>
                  prev.map((c) => (c.id === updated.id ? updated : c))
                )
              }
              onContactDeleted={(id) => {
                setContacts((prev) => prev.filter((c) => c.id !== id));
                setSelectedContact(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
