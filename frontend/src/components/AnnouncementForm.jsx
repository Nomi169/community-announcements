import { useState, useEffect } from 'react';

const CATEGORIES = ['events', 'alerts', 'news'];

export default function AnnouncementForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ title: '', description: '', category: 'news', pinned: false, ...initial });

  useEffect(() => {
    if (initial) setForm({ title: '', description: '', category: 'news', pinned: false, ...initial });
  }, [initial]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSubmit(e) { e.preventDefault(); onSubmit(form); }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-mono text-forest-600/60 mb-2 uppercase tracking-wider">Title *</label>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Announcement title" required className="input" />
      </div>

      <div>
        <label className="block text-xs font-mono text-forest-600/60 mb-2 uppercase tracking-wider">Description *</label>
        <textarea
          name="description" value={form.description} onChange={handleChange}
          placeholder="Full announcement text…" required rows={5}
          className="input resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-forest-600/60 mb-2 uppercase tracking-wider">Category *</label>
        <div className="flex gap-3">
          {CATEGORIES.map(cat => (
            <label key={cat} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all font-body text-sm
              ${form.category === cat
                ? 'bg-forest-600 text-cream-50 border-forest-600'
                : 'bg-white text-forest-700 border-forest-500/20 hover:bg-cream-100'}`}>
              <input type="radio" name="category" value={cat} checked={form.category === cat} onChange={handleChange} className="sr-only" />
              {cat === 'events' ? '🎉' : cat === 'alerts' ? '⚠️' : '📰'} {cat}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-forest-500/5 border border-forest-500/10">
        <div className={`w-10 h-6 rounded-full transition-colors relative ${form.pinned ? 'bg-forest-600' : 'bg-forest-500/20'}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.pinned ? 'translate-x-5' : 'translate-x-1'}`} />
        </div>
        <input type="checkbox" name="pinned" checked={form.pinned} onChange={handleChange} className="sr-only" />
        <div>
          <p className="text-sm font-body text-forest-800 font-medium">Pin to top</p>
          <p className="text-xs font-mono text-forest-500/60">Pinned posts appear first</p>
        </div>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 text-center">
          {loading ? 'Saving…' : initial?.id ? 'Update Announcement' : 'Publish Announcement'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary px-6">Cancel</button>
        )}
      </div>
    </form>
  );
}
