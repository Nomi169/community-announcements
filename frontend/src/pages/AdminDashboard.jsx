import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';
import AnnouncementForm from '../components/AnnouncementForm';
import { CategoryBadge } from '../components/AnnouncementCard';

const TABS = ['Announcements', 'Subscribers', 'Analytics'];

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-forest-500/10 rounded-xl flex items-center justify-center text-lg">{icon}</div>
      </div>
      <p className="font-display text-2xl text-forest-800">{value?.toLocaleString?.() ?? value}</p>
      <p className="font-body text-xs text-forest-600/60 mt-1">{label}</p>
      {sub && <p className="font-mono text-xs text-forest-500/40 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { token, isLoggedIn } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState('Announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editing, setEditing] = useState(null); // null = hidden, {} = new, {...} = edit
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { if (!isLoggedIn) nav('/admin/login'); }, [isLoggedIn]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [ann, subs, anal] = await Promise.all([
        apiFetch('/admin/announcements', {}, token),
        apiFetch('/admin/subscribers', {}, token),
        apiFetch('/admin/analytics', {}, token),
      ]);
      setAnnouncements(ann);
      setSubscribers(subs);
      setAnalytics(anal);
    } catch (e) { showToast(e.message, 'error'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { if (isLoggedIn) fetchAll(); }, [fetchAll, isLoggedIn]);

  async function handleFormSubmit(form) {
    setFormLoading(true);
    try {
      if (editing?.id) {
        await apiFetch(`/admin/announcements/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) }, token);
        showToast('Announcement updated!');
      } else {
        await apiFetch('/admin/announcements', { method: 'POST', body: JSON.stringify(form) }, token);
        showToast('Announcement published!');
      }
      setEditing(null);
      fetchAll();
    } catch (e) { showToast(e.message, 'error'); }
    finally { setFormLoading(false); }
  }

  async function handleDelete(id) {
    try {
      await apiFetch(`/admin/announcements/${id}`, { method: 'DELETE' }, token);
      setDeleteConfirm(null);
      showToast('Announcement deleted.');
      fetchAll();
    } catch (e) { showToast(e.message, 'error'); }
  }

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen relative z-10">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg font-mono text-sm animate-slide-up
          ${toast.type === 'error' ? 'bg-rust-500 text-white' : 'bg-forest-600 text-cream-50'}`}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-forest-900/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-cream-50 rounded-2xl p-8 max-w-sm w-full shadow-xl animate-slide-up">
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-display text-xl text-forest-800 mb-2">Delete Announcement?</h3>
              <p className="font-body text-sm text-forest-600/70 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-rust-500 text-white px-5 py-2.5 rounded-xl font-body font-medium text-sm hover:bg-rust-600 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-forest-800">Admin Dashboard</h1>
            <p className="font-body text-sm text-forest-600/60 mt-1">Manage your community announcements</p>
          </div>
          <button onClick={() => setEditing({})} className="btn-primary">
            + New Announcement
          </button>
        </div>

        {/* Quick stats */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon="📢" label="Total Posts" value={analytics.totalPosts} />
            <StatCard icon="👁" label="Total Views" value={analytics.totalViews} />
            <StatCard icon="📬" label="Subscribers" value={analytics.totalSubscribers} />
            <StatCard icon="📌" label="Pinned Posts" value={announcements.filter(a => a.pinned).length} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-cream-100 p-1 rounded-xl mb-6 w-fit">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-body font-medium transition-all
                ${tab === t ? 'bg-white text-forest-800 shadow-sm' : 'text-forest-600/60 hover:text-forest-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Form panel */}
        {editing !== null && (
          <div className="card p-8 mb-6">
            <h2 className="font-display text-xl text-forest-800 mb-6">
              {editing.id ? 'Edit Announcement' : 'New Announcement'}
            </h2>
            <AnnouncementForm
              initial={editing}
              onSubmit={handleFormSubmit}
              onCancel={() => setEditing(null)}
              loading={formLoading}
            />
          </div>
        )}

        {/* Announcements Tab */}
        {tab === 'Announcements' && (
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-forest-500/10 flex items-center justify-between">
              <h2 className="font-display text-lg text-forest-800">All Announcements</h2>
              <span className="text-xs font-mono text-forest-500/50">{announcements.length} total</span>
            </div>
            {loading ? (
              <div className="p-12 text-center font-mono text-sm text-forest-500/40">Loading…</div>
            ) : (
              <div className="divide-y divide-forest-500/10">
                {announcements.map(a => (
                  <div key={a.id} className="p-5 flex items-start gap-4 hover:bg-forest-500/5 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CategoryBadge category={a.category} />
                        {a.pinned && <span className="text-xs font-mono text-forest-500/50">📌</span>}
                      </div>
                      <p className="font-body font-medium text-forest-800 text-sm truncate">{a.title}</p>
                      <p className="font-mono text-xs text-forest-500/50 mt-1">
                        {new Date(a.created_at).toLocaleDateString()} · {a.views} views
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setEditing(a)} className="btn-secondary text-xs py-1.5 px-3">Edit</button>
                      <button onClick={() => setDeleteConfirm(a.id)} className="btn-danger text-xs py-1.5 px-3">Delete</button>
                    </div>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="font-mono text-sm text-forest-500/40">No announcements yet. Create one!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Subscribers Tab */}
        {tab === 'Subscribers' && (
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-forest-500/10 flex items-center justify-between">
              <h2 className="font-display text-lg text-forest-800">Email Subscribers</h2>
              <span className="text-xs font-mono text-forest-500/50">{subscribers.length} subscribers</span>
            </div>
            <div className="divide-y divide-forest-500/10">
              {subscribers.map(s => (
                <div key={s.id} className="p-5 flex items-center justify-between hover:bg-forest-500/5 transition-colors">
                  <div>
                    <p className="font-mono text-sm text-forest-800">{s.email}</p>
                    <p className="font-mono text-xs text-forest-500/50 mt-0.5">
                      {new Date(s.subscribed_at).toLocaleDateString()} · {s.categories}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {s.categories.split(',').map(c => (
                      <CategoryBadge key={c} category={c.trim()} />
                    ))}
                  </div>
                </div>
              ))}
              {subscribers.length === 0 && (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="font-mono text-sm text-forest-500/40">No subscribers yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {tab === 'Analytics' && analytics && (
          <div className="space-y-6">
            {/* Views by category */}
            <div className="card p-6">
              <h2 className="font-display text-lg text-forest-800 mb-6">Views by Category</h2>
              <div className="space-y-4">
                {analytics.byCategory.map(cat => {
                  const pct = analytics.totalViews > 0 ? Math.round((cat.views / analytics.totalViews) * 100) : 0;
                  const icons = { events: '🎉', alerts: '⚠️', news: '📰' };
                  const colors = { events: 'bg-amber-400', alerts: 'bg-rust-400', news: 'bg-forest-500' };
                  return (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{icons[cat.category]}</span>
                          <span className="font-body font-medium text-forest-800 text-sm capitalize">{cat.category}</span>
                          <span className="font-mono text-xs text-forest-500/50">{cat.count} posts</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm text-forest-800">{cat.views.toLocaleString()}</span>
                          <span className="font-mono text-xs text-forest-500/50 ml-1">views · {pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-forest-500/10 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[cat.category]} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top posts */}
            <div className="card p-6">
              <h2 className="font-display text-lg text-forest-800 mb-6">Top Performing Posts</h2>
              <div className="space-y-3">
                {analytics.topPosts.map((post, i) => (
                  <div key={post.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-forest-500/5 transition-colors">
                    <span className={`w-7 h-7 flex items-center justify-center rounded-lg font-mono text-xs font-bold
                      ${i === 0 ? 'bg-amber-400/30 text-amber-600' : i === 1 ? 'bg-forest-500/20 text-forest-600' : 'bg-cream-100 text-forest-500/60'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-forest-800 truncate">{post.title}</p>
                      <CategoryBadge category={post.category} />
                    </div>
                    <span className="font-mono text-sm text-forest-700 font-medium">{post.views.toLocaleString()}</span>
                    <span className="font-mono text-xs text-forest-500/40">views</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
