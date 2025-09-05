import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  homeAddress?: string;
  workAddress?: string;
};

export type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  register: (
    name: string,
    email: string,
    password: string,
    homeAddress: string,
    workAddress: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  updateAddresses: (homeAddress: string, workAddress: string) => Promise<{ ok: true } | { ok: false; error: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'users_v1';
const SESSION_KEY = 'auth_user_v1';

// Lazy-load AsyncStorage to avoid crashing if the package isn't installed yet
function getAsyncStorage(): any | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@react-native-async-storage/async-storage').default;
  } catch (_e) {
    return undefined;
  }
}

function genId() {
  return 'u_' + Math.random().toString(36).slice(2, 10);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const AsyncStorage = getAsyncStorage();

  // Hydrate session
  useEffect(() => {
    const hydrate = async () => {
      try {
        if (!AsyncStorage) {
          setLoading(false);
          return;
        }
        const sessionJson = await AsyncStorage.getItem(SESSION_KEY);
        if (sessionJson) setUser(JSON.parse(sessionJson));
      } catch {}
      setLoading(false);
    };
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const readUsers = async (): Promise<Array<{ id: string; name: string; email: string; password: string; homeAddress?: string; workAddress?: string }>> => {
    if (!AsyncStorage) return [];
    const json = await AsyncStorage.getItem(USERS_KEY);
    if (!json) return [];
    try {
      const arr = JSON.parse(json);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const writeUsers = async (users: Array<{ id: string; name: string; email: string; password: string; homeAddress?: string; workAddress?: string }>) => {
    if (!AsyncStorage) return;
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const persistSession = async (u: AuthUser | null) => {
    if (!AsyncStorage) return;
    if (u) await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else await AsyncStorage.removeItem(SESSION_KEY);
  };

  const register = async (name: string, email: string, password: string, homeAddress: string, workAddress: string) => {
    const emailNorm = email.trim().toLowerCase();
    if (!emailNorm || !password || !name.trim() || !homeAddress.trim() || !workAddress.trim()) {
      return { ok: false as const, error: 'All fields are required.' };
    }
    try {
      const users = await readUsers();
      if (users.some((u) => u.email === emailNorm)) {
        return { ok: false as const, error: 'Email already registered.' };
      }
      const newUser = { id: genId(), name: name.trim(), email: emailNorm, password, homeAddress: homeAddress.trim(), workAddress: workAddress.trim() };
      const next = [...users, newUser];
      await writeUsers(next);
      const session: AuthUser = { id: newUser.id, name: newUser.name, email: newUser.email, homeAddress: newUser.homeAddress, workAddress: newUser.workAddress };
      setUser(session);
      await persistSession(session);
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: 'Failed to register.' };
    }
  };

  const login = async (email: string, password: string) => {
    const emailNorm = email.trim().toLowerCase();
    if (!emailNorm || !password) return { ok: false as const, error: 'Email and password required.' };
    try {
      const users = await readUsers();
      const found = users.find((u) => u.email === emailNorm && u.password === password);
      if (!found) return { ok: false as const, error: 'Invalid credentials.' };
      const session: AuthUser = { id: found.id, name: found.name, email: found.email, homeAddress: found.homeAddress, workAddress: found.workAddress };
      setUser(session);
      await persistSession(session);
      return { ok: true as const };
    } catch {
      return { ok: false as const, error: 'Failed to login.' };
    }
  };

  const logout = async () => {
    setUser(null);
    await persistSession(null);
  };

  const updateAddresses = async (homeAddress: string, workAddress: string) => {
    try {
      if (!user) return { ok: false as const, error: 'Not authenticated.' };
      const users = await readUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx === -1) return { ok: false as const, error: 'User not found.' };
      const updated = {
        ...users[idx],
        homeAddress: homeAddress?.trim() || '',
        workAddress: workAddress?.trim() || '',
      };
      const next = [...users];
      next[idx] = updated;
      await writeUsers(next);
      const newSession: AuthUser = {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        homeAddress: updated.homeAddress,
        workAddress: updated.workAddress,
      };
      setUser(newSession);
      await persistSession(newSession);
      return { ok: true as const };
    } catch {
      return { ok: false as const, error: 'Failed to update addresses.' };
    }
  };

  const value = useMemo(() => ({ user, loading, register, login, logout, updateAddresses }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
