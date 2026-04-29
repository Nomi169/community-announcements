const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'community_announcements_secret_2024';
const DB_PATH = path.join(__dirname, 'announcements.db.json');

app.use(cors());
app.use(express.json());

let data = { announcements: [], subscribers: [], admins: [], nextAnnouncementId: 1, nextSubscriberId: 1 };
if (fs.existsSync(DB_PATH)) { try { data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); } catch(e){} }
function save() { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); }

if (!data.admins.find(a => a.username === 'admin')) {
  data.admins.push({ id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 10) });
  save();
  console.log('Admin created: admin / admin123');
}

if (data.announcements.length === 0) {
  const now = new Date().toISOString();
  [
    { title: 'Welcome to Our Community Platform', description: 'We are thrilled to launch this new community announcements platform. Stay tuned for updates, events, and important alerts from your neighborhood.', category: 'news', views: 142, pinned: true },
    { title: 'Summer Festival 2024', description: 'Join us for the annual summer festival at Central Park on July 15th. Live music, food stalls, and activities for all ages. Free entry for residents!', category: 'events', views: 89, pinned: false },
    { title: 'Water Supply Maintenance Alert', description: 'Scheduled maintenance on the water supply network will take place on June 28th from 9AM to 3PM. Please store sufficient water beforehand.', category: 'alerts', views: 203, pinned: true },
    { title: 'Community Clean-Up Drive', description: 'Volunteers needed for the monthly neighborhood clean-up. Gloves and equipment provided. Meet at the town square at 8AM.', category: 'events', views: 57, pinned: false },
    { title: 'New Bus Route Announced', description: 'The city has announced a new bus route (Route 47) connecting the east residential area to the central market, starting August 1st.', category: 'news', views: 76, pinned: false },
  ].forEach(s => data.announcements.push({ id: data.nextAnnouncementId++, ...s, author: 'Admin', created_at: now, updated_at: now }));
  save();
}

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try { req.admin = jwt.verify(token, JWT_SECRET); next(); } catch { res.status(401).json({ error: 'Invalid token' }); }
}

app.get('/api/announcements', (req, res) => {
  const { category } = req.query;
  let list = [...data.announcements];
  if (category && category !== 'all') list = list.filter(a => a.category === category);
  list.sort((a, b) => (b.pinned - a.pinned) || new Date(b.created_at) - new Date(a.created_at));
  res.json(list);
});

app.get('/api/announcements/:id', (req, res) => {
  const item = data.announcements.find(a => a.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  item.views = (item.views || 0) + 1; save();
  res.json(item);
});

app.post('/api/subscribe', (req, res) => {
  const { email, categories } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' });
  const existing = data.subscribers.find(s => s.email === email);
  if (existing) { existing.categories = categories || 'events,alerts,news'; save(); return res.json({ message: 'Subscription updated!' }); }
  data.subscribers.push({ id: data.nextSubscriberId++, email, categories: categories || 'events,alerts,news', subscribed_at: new Date().toISOString() });
  save(); res.json({ message: 'Subscribed successfully!' });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = data.admins.find(a => a.username === username);
  if (!admin || !bcrypt.compareSync(password, admin.password)) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username: admin.username });
});

app.get('/api/admin/announcements', auth, (req, res) => {
  res.json([...data.announcements].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

app.post('/api/admin/announcements', auth, (req, res) => {
  const { title, description, category, pinned } = req.body;
  if (!title || !description || !category) return res.status(400).json({ error: 'Missing fields' });
  const now = new Date().toISOString();
  const item = { id: data.nextAnnouncementId++, title, description, category, pinned: !!pinned, author: 'Admin', views: 0, created_at: now, updated_at: now };
  data.announcements.push(item); save(); res.status(201).json(item);
});

app.put('/api/admin/announcements/:id', auth, (req, res) => {
  const item = data.announcements.find(a => a.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  const { title, description, category, pinned } = req.body;
  Object.assign(item, { title, description, category, pinned: !!pinned, updated_at: new Date().toISOString() });
  save(); res.json(item);
});

app.delete('/api/admin/announcements/:id', auth, (req, res) => {
  data.announcements = data.announcements.filter(a => a.id !== parseInt(req.params.id));
  save(); res.json({ message: 'Deleted' });
});

app.get('/api/admin/subscribers', auth, (req, res) => {
  res.json([...data.subscribers].sort((a, b) => new Date(b.subscribed_at) - new Date(a.subscribed_at)));
});

app.get('/api/admin/analytics', auth, (req, res) => {
  const totalViews = data.announcements.reduce((s, a) => s + (a.views || 0), 0);
  const byCategory = ['events', 'alerts', 'news'].map(cat => ({
    category: cat,
    count: data.announcements.filter(a => a.category === cat).length,
    views: data.announcements.filter(a => a.category === cat).reduce((s, a) => s + (a.views || 0), 0),
  }));
  const topPosts = [...data.announcements].sort((a, b) => (b.views||0) - (a.views||0)).slice(0, 5)
    .map(({ id, title, views, category }) => ({ id, title, views, category }));
  res.json({ totalViews, totalPosts: data.announcements.length, totalSubscribers: data.subscribers.length, byCategory, topPosts });
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));