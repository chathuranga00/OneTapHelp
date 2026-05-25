import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import type { ContactRelation } from '../constants/relations';

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relation: ContactRelation;
};

type AppState = {
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  isSosActive: boolean;
  activeSosEventId: string | null;
  sosStartedAt: number | null;
  emergencyContacts: EmergencyContact[];
  setHasCompletedOnboarding: (value: boolean) => void;
  setSession: (session: Session | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsSosActive: (value: boolean) => void;
  setActiveSos: (eventId: string, startedAt: number) => void;
  clearActiveSos: () => void;
  setEmergencyContacts: (contacts: EmergencyContact[]) => void;
  addEmergencyContact: (contact: EmergencyContact) => void;
  reset: () => void;
};

const initialState = {
  hasCompletedOnboarding: false,
  isAuthenticated: false,
  session: null as Session | null,
  isSosActive: false,
  activeSosEventId: null as string | null,
  sosStartedAt: null as number | null,
  emergencyContacts: [] as EmergencyContact[],
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
  setSession: (session) =>
    set({
      session,
      isAuthenticated: session !== null,
    }),
  setIsAuthenticated: (value) =>
    set((state) => ({
      isAuthenticated: value,
      session: value ? state.session : null,
    })),
  setIsSosActive: (value) => set({ isSosActive: value }),
  setActiveSos: (eventId, startedAt) =>
    set({
      activeSosEventId: eventId,
      sosStartedAt: startedAt,
      isSosActive: true,
    }),
  clearActiveSos: () =>
    set({
      activeSosEventId: null,
      sosStartedAt: null,
      isSosActive: false,
    }),
  setEmergencyContacts: (contacts) => set({ emergencyContacts: contacts }),
  addEmergencyContact: (contact) =>
    set((state) => ({
      emergencyContacts: [...state.emergencyContacts, contact],
    })),
  reset: () => set(initialState),
}));
