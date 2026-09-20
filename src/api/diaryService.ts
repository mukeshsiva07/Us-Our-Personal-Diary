/// <reference types="vite/client" />
const API_BASE = import.meta.env.VITE_API_BASE_URL as string;
const AUTH_KEY = 'copiko_milo_auth_session_v1';

export const diaryService = {
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return { success: false };
    const data = await res.json();
    sessionStorage.setItem(AUTH_KEY, JSON.stringify({
      username: data.username, displayName: 'Mukesh & Anne', justLoggedIn: true,
    }));
    return { success: true };
  },

  getCurrentSession() {
    const raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  clearJustLoggedInFlag() {
    const s = this.getCurrentSession();
    if (s) { delete s.justLoggedIn; sessionStorage.setItem(AUTH_KEY, JSON.stringify(s)); }
  },
  logout() { sessionStorage.removeItem(AUTH_KEY); },

  async listEntries(section: string) {
    const res = await fetch(`${API_BASE}/entries?section=${section}`);
    const rows = await res.json();
    return rows.map((e: any) => ({
      ...e,
      excerpt: e.content?.content?.find((n: any) => n.type === 'paragraph')
        ?.content?.map((c: any) => c.text || '').join('').slice(0, 130) || '',
    }));
  },
  async getEntry(id: string) {
    const res = await fetch(`${API_BASE}/entries/${id}`);
    if (!res.ok) throw new Error('Entry not found');
    return res.json();
  },
  async createEntry(section: string, draft: any) {
    const res = await fetch(`${API_BASE}/entries`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, section }),
    });
    return res.json();
  },
  async updateEntry(id: string, draft: any) {
    const res = await fetch(`${API_BASE}/entries/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    return res.json();
  },
  async deleteEntry(id: string) {
    await fetch(`${API_BASE}/entries/${id}`, { method: 'DELETE' });
  },
  async uploadMedia(file: File) {
    return new Promise<{ url: string; type: 'image' | 'video' }>((resolve, reject) => {
      const isVideo = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = () => resolve({ url: reader.result as string, type: isVideo ? 'video' : 'image' });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};