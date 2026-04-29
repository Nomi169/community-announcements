import { useEffect } from 'react';
import { CategoryBadge } from './AnnouncementCard';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function AnnouncementModal({ announcement, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  if (!announcement) return null;
  const { title, description, category, created_at, views, author } = announcement;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-cream-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-forest-500/10 flex items-center justify-center text-forest-600 hover:bg-forest-500/20 transition-colors text-sm"
          >
            ✕
          </button>

          <div className="mb-4">
            <CategoryBadge category={category} />
          </div>
          <h2 className="font-display text-2xl text-forest-800 leading-tight mb-4">{title}</h2>
          <p className="font-body text-forest-700/80 leading-relaxed text-base">{description}</p>

          <div className="mt-8 pt-6 border-t border-forest-500/10 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-forest-500/50 text-xs font-mono">📅</span>
              <span className="text-xs font-mono text-forest-500/70">{formatDate(created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-forest-500/50 text-xs font-mono">👁</span>
              <span className="text-xs font-mono text-forest-500/70">{views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-forest-500/50 text-xs font-mono">✍️</span>
              <span className="text-xs font-mono text-forest-500/70">{author}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
