import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await apiFetch('/admin/login', {
        method: 'POST', body: JSON.stringify(form)
      });
      login(data.token, data.username);
      nav('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative z-10 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-forest-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-display font-bold text-cream-50">C</span>
          </div>
          <h1 className="font-display text-2xl text-forest-800">Admin Access</h1>
          <p className="font-body text-sm text-forest-600/60 mt-1">Sign in to manage announcements</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-forest-600/60 mb-2 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({...f, username: e.target.value}))}
                placeholder="admin"
                required
                className="input"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-forest-600/60 mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({...f, password: e.target.value}))}
                placeholder="••••••••"
                required
                className="input"
              />
            </div>

            {error && (
              <div className="bg-rust-400/10 border border-rust-400/20 rounded-xl p-3">
                <p className="text-xs font-mono text-rust-500">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full text-center justify-center py-3 mt-2">
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-forest-500/10">
            <p className="text-xs font-mono text-forest-500/40 text-center">
              Default: admin / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
