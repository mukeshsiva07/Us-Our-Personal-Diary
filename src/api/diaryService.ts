import { Entry, EntryDraft, EntrySummary, SectionType } from '../types/diary';

const STORAGE_KEY = 'copiko_milo_diary_entries_v1';
const AUTH_KEY = 'copiko_milo_auth_session_v1';

// Seed sample entries so the diary is vibrant immediately upon login
const INITIAL_ENTRIES: Entry[] = [
  {
    id: 'entry-mukesh-1',
    section: 'mukesh',
    title: 'Leica M6 & Fog over the Nilgiri Hills',
    date: '2026-08-14',
    coverUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    coverOffsetY: 35,
    icon: '📷',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2, textAlign: 'left' },
          content: [{ type: 'text', text: 'Waiting for the Mist to Clear' }]
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [
            { type: 'text', text: 'Woke up at 5:15 AM before the tea estate stir began. The cold air bites through the wool jacket, but looking through the mechanical rangefinder patch brings a quiet rhythm you never get with digital glass.' }
          ]
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: '“To take a photograph is to align the head, the eye, and the heart. It’s a way of living.” — Henri Cartier-Bresson' }
              ]
            }
          ]
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [
            { type: 'text', text: 'Managed to shoot half a roll of Tri-X 400 before the clouds rolled completely down into the valley. Here are the camera settings logged from this morning:' }
          ]
        },
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Frame #' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Lens' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Aperture' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Shutter' }] }] }
              ]
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '01 - 06' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Summicron 35mm' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'f/2.8' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '1/125s' }] }] }
              ]
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '07 - 14' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Elmarit 90mm' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'f/4.0' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '1/250s' }] }] }
              ]
            }
          ]
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [
            { type: 'text', text: 'Can’t wait to show Anne how the silver gelatin prints turn out once I develop the roll back home.' }
          ]
        }
      ]
    },
    drawingLayer: '',
    mediaItems: [
      {
        id: 'media-m1',
        url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        type: 'image',
        placement: 'overlay',
        position: { x: 30, y: 380 },
        caption: 'The trusty M6 on the ledge'
      }
    ]
  },
  {
    id: 'entry-anne-1',
    section: 'anne',
    title: 'The Windswept Cliffs of Sagres',
    date: '2026-08-20',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    coverOffsetY: 40,
    icon: '🧭',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2, textAlign: 'left' },
          content: [{ type: 'text', text: 'At the Edge of the Known World' }]
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [
            { type: 'text', text: 'They used to believe this was the literal finisterra — where the ocean drops into nothingness. The wind here is relentless and wild; it blew my sunhat twenty feet down toward the rocks before a miraculous gust caught it on a wild thyme shrub.' }
          ]
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [
            { type: 'text', text: 'I sat with my battered travel notebook on the stone bench overlooking Cabo de São Vicente. The Atlantic here is a deep turquoise churn, striking against the ochre limestone.' }
          ]
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: '“Travel isn’t always comfortable. Sometimes it hurts, it even breaks your heart. But that’s okay. The journey changes you.”' }
              ]
            }
          ]
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [
            { type: 'text', text: 'Tasted the most heavenly pastéis de nata from a quiet village bakery on the path down. Saved half of a cinnamon stick in my pocket for Mukesh.' }
          ]
        }
      ]
    },
    drawingLayer: '',
    mediaItems: [
      {
        id: 'media-a1',
        url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
        type: 'image',
        placement: 'overlay',
        position: { x: 45, y: 320 },
        caption: 'Wild waves against the ochre cliffs'
      }
    ]
  },
  {
    id: 'entry-combined-1',
    section: 'combined',
    title: 'Our Rainy Evening in Kyoto Under Lanterns',
    date: '2026-09-02',
    coverUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
    coverOffsetY: 25,
    icon: '🏮',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2, textAlign: 'left' },
          content: [{ type: 'text', text: 'Gion Alleyways in the September Downpour' }]
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [
            { type: 'text', text: 'The forecast promised clear skies, but Kyoto had other plans. What started as light drizzle turned into a sudden cloudburst right by the canal.' }
          ]
        }
      ]
    },
    drawingLayer: '',
    mediaItems: [
      {
        id: 'media-c1',
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        type: 'image',
        placement: 'overlay',
        position: { x: 40, y: 330 },
        caption: 'Paper lanterns glowing in the rain'
      }
    ],
    povContent: {
      copiko: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2, textAlign: 'left' },
            content: [{ type: 'text', text: "Copiko's Perspective — The Little Wooden Tearoom" }]
          },
          {
            type: 'paragraph',
            attrs: { textAlign: 'left' },
            content: [
              { type: 'text', text: 'I remember pulling Milo by the sleeve because my canvas shoes were completely soaked through! We ducked under an eaves where red paper lanterns were swaying in the storm.' }
            ]
          },
          {
            type: 'paragraph',
            attrs: { textAlign: 'left' },
            content: [
              { type: 'text', text: 'He held the tiny folding umbrella mostly over my head, totally ignoring that his entire left shoulder was drenched. That warmth in his eyes when he laughed at my dripping hair — that is my favorite memory of the whole year.' }
            ]
          },
          {
            type: 'blockquote',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: '“Two souls with but a single thought, two hearts that beat as one.”' }
                ]
              }
            ]
          },
          {
            type: 'paragraph',
            attrs: { textAlign: 'left' },
            content: [
              { type: 'text', text: 'The hot roasted hojicha tea we drank in the corner seat was the sweetest thing I’ve ever tasted.' }
            ]
          }
        ]
      },
      milo: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2, textAlign: 'left' },
            content: [{ type: 'text', text: "Milo's Perspective — The Rain We Never Wanted to Stop" }]
          },
          {
            type: 'paragraph',
            attrs: { textAlign: 'left' },
            content: [
              { type: 'text', text: 'I saw the clouds gathering over Higashiyama forty minutes earlier, but I didn’t say a word because Copiko was looking at the ceramic wind chimes with so much wonder.' }
            ]
          },
          {
            type: 'paragraph',
            attrs: { textAlign: 'left' },
            content: [
              { type: 'text', text: 'When the sky opened, running through the narrow cobblestone streets holding hands was pure joy. My camera was wrapped safe inside my waterproof pouch, but my real focus was just keeping her warm.' }
            ]
          },
          {
            type: 'paragraph',
            attrs: { textAlign: 'left' },
            content: [
              { type: 'text', text: 'While she warmed her hands around the ceramic tea bowl, I took a mental photograph that no 35mm film could ever do justice to.' }
            ]
          }
        ]
      }
    }
  }
];

function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ENTRIES));
      return INITIAL_ENTRIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ENTRIES;
  }
}

function saveEntries(entries: Entry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save entries to localStorage', e);
  }
}

export const diaryService = {
  // Auth
  async login(username: string, password: string): Promise<{ success: boolean; token?: string }> {
    // Artificial latency for authentic network feel
    await new Promise((resolve) => setTimeout(resolve, 350));
    
    const validUser = 'muke_jovi';
    const validPass = 'copiko&milo2507';

    if (username === validUser && password === validPass) {
      const token = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(AUTH_KEY, JSON.stringify({
        username: validUser,
        displayName: 'Mukesh & Anne',
        token,
        justLoggedIn: true,
      }));
      return { success: true, token };
    }
    return { success: false };
  },

  getCurrentSession(): { username: string; displayName: string; token: string; justLoggedIn?: boolean } | null {
    try {
      const raw = sessionStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  clearJustLoggedInFlag(): void {
    try {
      const session = this.getCurrentSession();
      if (session) {
        delete session.justLoggedIn;
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
      }
    } catch {
      // ignore
    }
  },

  logout(): void {
    sessionStorage.removeItem(AUTH_KEY);
  },

  // Entries
  async listEntries(section: SectionType): Promise<EntrySummary[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const entries = loadEntries();
    return entries
      .filter((e) => e.section === section)
      .map((e) => {
        let excerpt = '';
        if (e.content && e.content.content) {
          const firstParagraph = e.content.content.find((n) => n.type === 'paragraph');
          if (firstParagraph && firstParagraph.content) {
            excerpt = firstParagraph.content.map((c) => c.text || '').join('');
          }
        }
        return {
          id: e.id,
          section: e.section,
          title: e.title,
          date: e.date,
          coverUrl: e.coverUrl,
          coverOffsetY: e.coverOffsetY,
          icon: e.icon,
          excerpt: excerpt.length > 130 ? excerpt.slice(0, 130) + '…' : excerpt,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getEntry(id: string): Promise<Entry> {
    await new Promise((resolve) => setTimeout(resolve, 120));
    const entries = loadEntries();
    const found = entries.find((e) => e.id === id);
    if (!found) {
      throw new Error(`Entry with id "${id}" not found.`);
    }
    return JSON.parse(JSON.stringify(found));
  },

  async createEntry(section: SectionType, draft: EntryDraft): Promise<Entry> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const entries = loadEntries();
    const newEntry: Entry = {
      ...draft,
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      section,
    };
    entries.unshift(newEntry);
    saveEntries(entries);
    return newEntry;
  },

  async updateEntry(id: string, draft: EntryDraft): Promise<Entry> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const entries = loadEntries();
    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error(`Entry with id "${id}" not found for update.`);
    }
    const updated: Entry = {
      ...draft,
      id,
    };
    entries[index] = updated;
    saveEntries(entries);
    return updated;
  },

  async deleteEntry(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const entries = loadEntries();
    const filtered = entries.filter((e) => e.id !== id);
    saveEntries(filtered);
  },

  // Media
  async uploadMedia(file: File): Promise<{ url: string; type: 'image' | 'video' }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return new Promise((resolve, reject) => {
      const isVideo = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          type: isVideo ? 'video' : 'image',
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },
};

