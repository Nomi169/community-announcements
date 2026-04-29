import { useState } from 'react';
import { apiFetch } from '../api';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch('/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
      setStatus('success');
      setMsg(res.message);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMsg(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  }

  return (
    <div className="bg-forest-700 rounded-2xl p-8 text-cream-50 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-forest-600/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-forest-800/60 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📬</span>
          <h3 className="font-display text-xl text-cream-50">Stay in the Loop</h3>
        </div>
        <p className="font-body text-sm text-cream-100/70 mb-6 leading-relaxed">
          Get notified when new announcements are posted in your community.
        </p>

        {status === 'success' ? (
          <div className="flex items-center gap-3 bg-forest-600/60 rounded-xl p-4 border border-forest-400/30">
            <span className="text-lg">✅</span>
            <span className="text-sm font-body text-cream-100">{msg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 rounded-xl bg-forest-800/60 border border-forest-400/20 text-cream-50 placeholder-cream-100/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-forest-400/40 focus:border-forest-400/50 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-400 text-forest-900 px-5 py-3 rounded-xl font-body font-semibold text-sm hover:bg-amber-300 transition-all active:scale-95 disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-rust-400 text-xs mt-2 font-mono">{msg}</p>
        )}
      </div>
    </div>
  );
}
