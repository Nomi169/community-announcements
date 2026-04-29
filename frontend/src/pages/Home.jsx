import { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import AnnouncementCard from '../components/AnnouncementCard';
import AnnouncementModal from '../components/AnnouncementModal';
import SubscribeForm from '../components/SubscribeForm';

const CATEGORIES = [
  { value: 'all', label: 'All', icon: '🗂' },
  { value: 'events', label: 'Events', icon: '🎉' },
  { value: 'alerts', label: 'Alerts', icon: '⚠️' },
  { value: 'news', label: 'News', icon: '📰' },
];

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  async function fetchAnnouncements(cat) {
    setLoading(true);
    try {
      const params = cat !== 'all' ? `?category=${cat}` : '';
      const data = await apiFetch(`/announcements${params}`);
      setAnnouncements(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAnnouncements(category); }, [category]);

  async function openAnnouncement(a) {
    try {
      const full = await apiFetch(`/announcements/${a.id}`);
      setSelected(full);
    } catch {
      setSelected(a);
    }
  }

  const filtered = announcements.filter(a =>
    !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero */}
      <div className="bg-forest-700 text-cream-50 py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #5a8a6a 0%, transparent 60%), radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 50%)' }} />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-forest-600/50 rounded-full px-4 py-1.5 mb-6 border border-forest-400/20">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse-soft" />
            <span className="text-xs font-mono text-cream-100/80">Live Community Board</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-cream-50 mb-4 leading-tight">
            Community<br /><em>Announcements</em>
          </h1>
          <p className="font-body text-cream-100/70 text-base max-w-md mx-auto">
            Your neighborhood's official board for events, alerts, and local news.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-500/40 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search announcements…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-body font-medium transition-all border ${
                  category === cat.value
                    ? 'bg-forest-600 text-cream-50 border-forest-600'
                    : 'bg-white text-forest-700 border-forest-500/20 hover:bg-cream-100'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-6 mb-6 px-1">
          <span className="text-xs font-mono text-forest-500/60">
            {filtered.length} announcement{filtered.length !== 1 ? 's' : ''}
          </span>
          {search && (
            <button onClick={() => setSearch('')} className="text-xs font-mono text-rust-500 hover:underline">
              clear search
            </button>
          )}
        </div>

        {/* Announcements list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-forest-500/10 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-forest-500/10 rounded w-16" />
                    <div className="h-5 bg-forest-500/10 rounded w-3/4" />
                    <div className="h-3 bg-forest-500/10 rounded w-full" />
                    <div className="h-3 bg-forest-500/10 rounded w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-display text-xl text-forest-700">No announcements found</p>
            <p className="font-body text-sm text-forest-500/60 mt-2">Try a different category or search term</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(a => (
              <div key={a.id} className="stagger-child">
                <AnnouncementCard announcement={a} onClick={() => openAnnouncement(a)} />
              </div>
            ))}
          </div>
        )}

        {/* Subscribe section */}
        <div className="mt-14">
          <SubscribeForm />
        </div>
        
      </div>
      {/* Modal */}
      {selected && (
        <AnnouncementModal announcement={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
