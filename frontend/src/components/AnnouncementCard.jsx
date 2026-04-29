export function CategoryBadge({ category, size = 'sm' }) {
  const labels = { events: '🎉 Event', alerts: '⚠️ Alert', news: '📰 News' };
  const cls = { events: 'badge-events', alerts: 'badge-alerts', news: 'badge-news' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${cls[category]}`}>
      {labels[category] || category}
    </span>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function AnnouncementCard({ announcement, onClick }) {
  const { title, description, category, created_at, views, pinned } = announcement;
  return (
    <div
      onClick={onClick}
      className={`card p-6 cursor-pointer group relative overflow-hidden ${pinned ? 'border-forest-500/20 bg-forest-500/5' : ''}`}
    >
      {pinned && (
        <div className="absolute top-3 right-3">
          <span className="text-forest-500/60 text-xs font-mono">📌 pinned</span>
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5
          ${category === 'events' ? 'bg-amber-400/20' : category === 'alerts' ? 'bg-rust-400/20' : 'bg-forest-400/20'}`}>
          <span className="text-lg">{category === 'events' ? '🎉' : category === 'alerts' ? '⚠️' : '📰'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <CategoryBadge category={category} />
          </div>
          <h3 className="font-display text-lg text-forest-800 leading-snug group-hover:text-forest-600 transition-colors mb-2 pr-16">
            {title}
          </h3>
          <p className="font-body text-sm text-forest-600/70 leading-relaxed line-clamp-2">
            {description}
          </p>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-forest-500/10">
            <span className="text-xs font-mono text-forest-500/60">{formatDate(created_at)}</span>
            <span className="text-xs font-mono text-forest-500/40">·</span>
            <span className="text-xs font-mono text-forest-500/60">{views || 0} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
