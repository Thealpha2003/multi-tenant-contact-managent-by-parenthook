import { create } from "zustand";

export const useAppStore = create((set) => ({
  activeTenantId: 1,
  selectedContactId: null,

  setActiveTenant: (tenantId) =>
    set({ activeTenantId: tenantId, selectedContactId: null }),

  setSelectedContact: (contactId) =>
    set({ selectedContactId: contactId }),
}));
