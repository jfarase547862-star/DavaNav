import { useEffect, useState, useCallback } from "react";
import {
  seedDepartments, seedOffices, seedQrCodes, seedUsers, seedNodes,
  seedFloorMaps, seedNotifications, defaultRolePerms,
  type Department, type Office, type QrCode, type User, type NavNode,
  type FloorMap, type Notification,
} from "./mock-data";

const KEY = "navix-admin-state-v1";
const AUTH_KEY = "navix-admin-auth-v1";

interface State {
  departments: Department[];
  offices: Office[];
  qrCodes: QrCode[];
  users: User[];
  nodes: NavNode[];
  floorMaps: FloorMap[];
  notifications: Notification[];
  rolePerms: Record<string, Record<string, boolean>>;
  settings: {
    siteName: string;
    language: string;
    theme: "light" | "dark";
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
}

const initialState: State = {
  departments: seedDepartments,
  offices: seedOffices,
  qrCodes: seedQrCodes,
  users: seedUsers,
  nodes: seedNodes,
  floorMaps: seedFloorMaps,
  notifications: seedNotifications,
  rolePerms: defaultRolePerms,
  settings: {
    siteName: "Navix Solution — Davao City Hall",
    language: "English",
    theme: "light",
    emailNotifications: true,
    pushNotifications: false,
  },
};

type Listener = () => void;
const listeners = new Set<Listener>();
let state: State = initialState;
let loaded = false;

function load() {
  if (loaded || typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initialState, ...JSON.parse(raw) };
  } catch {}
  loaded = true;
}

function persist() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

function notify() { listeners.forEach((l) => l()); }

export function setState(updater: (s: State) => State) {
  state = updater(state);
  persist();
  notify();
}

export function useAdminStore<T>(selector: (s: State) => T): T {
  load();
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return selector(state);
}

export const useAdminState = () => useAdminStore((s) => s);

export const id = () => Math.random().toString(36).slice(2, 9);

// Auth
export interface AuthUser { email: string; name: string; role: string; }

export function login(email: string, password: string): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (password.length < 4) return reject(new Error("Invalid credentials"));
      const user: AuthUser = {
        email,
        name: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        role: "Super Administrator",
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      }
      resolve(user);
    }, 900);
  });
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY);
}

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function useAuth(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => { setUser(getAuth()); }, []);
  return user;
}

export function resetStore() {
  state = initialState;
  persist();
  notify();
}
