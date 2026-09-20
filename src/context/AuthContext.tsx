import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface StoredProfile {
  user: LocalUser;
  passwordHash: string;
}

interface AuthContextValue {
  user: LocalUser | null;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const PROFILE_KEY = "redthread_local_profile_v1";
const SESSION_KEY = "redthread_local_session_v1";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readProfile(): StoredProfile | null {
  try {
    const rawProfile = localStorage.getItem(PROFILE_KEY);
    return rawProfile ? (JSON.parse(rawProfile) as StoredProfile) : null;
  } catch {
    return null;
  }
}

async function hashPassword(password: string): Promise<string> {
  if (!window.crypto?.subtle) {
    throw new Error("Secure local sign-in is unavailable in this browser.");
  }

  const encoded = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const hasSession = localStorage.getItem(SESSION_KEY) === "active";
      const profile = readProfile();
      if (hasSession && profile?.user) {
        setUser(profile.user);
      }
    } finally {
      setIsReady(true);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      async signUp(name, email, password) {
        const normalisedEmail = email.trim().toLowerCase();
        const existingProfile = readProfile();

        if (existingProfile) {
          throw new Error("A local profile already exists on this device. Try logging in instead.");
        }

        const newUser: LocalUser = {
          id: `local-${Date.now()}`,
          name: name.trim(),
          email: normalisedEmail,
          createdAt: new Date().toISOString(),
        };

        const profile: StoredProfile = {
          user: newUser,
          passwordHash: await hashPassword(password),
        };

        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        localStorage.setItem(SESSION_KEY, "active");
        setUser(newUser);
      },
      async signIn(email, password) {
        const profile = readProfile();
        const normalisedEmail = email.trim().toLowerCase();

        if (!profile || profile.user.email !== normalisedEmail) {
          throw new Error("No local profile was found for this email. Create one to continue.");
        }

        const passwordHash = await hashPassword(password);
        if (passwordHash !== profile.passwordHash) {
          throw new Error("That password does not match this local profile.");
        }

        localStorage.setItem(SESSION_KEY, "active");
        setUser(profile.user);
      },
      signOut() {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      },
    }),
    [isReady, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
