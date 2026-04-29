# 🏘️ Community Announcements Platform

A full-stack community announcements web app with a polished public-facing board and a complete admin panel.

---

## ✨ Features

### Public Side
- 📋 View all announcements with title, date, description, and view count
- 🔍 Search announcements by keyword
- 🗂 Filter by category: **Events**, **Alerts**, **News**
- 📌 Pinned announcements shown at the top
- 👁 Click any announcement to open full detail modal (increments view count)
- 📬 Subscribe to email updates via subscribe form

### Admin Panel
- 🔐 JWT-authenticated login (admin / admin123)
- ➕ Create new announcements with title, description, category, and pin toggle
- ✏️ Edit any existing announcement
- 🗑️ Delete announcements (with confirmation dialog)
- 📊 **Analytics tab**: views by category (bar chart), top 5 most-viewed posts
- 📬 **Subscribers tab**: view all subscriber emails + their category preferences
- 📈 Quick stats: total posts, total views, subscriber count, pinned count

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm

### 1. Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start Both Servers

```bash
# From project root
chmod +x start.sh
./start.sh
```

Or start manually in two terminals:

**Terminal 1 – Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Open in Browser

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Public Announcements Board |
| http://localhost:5173/admin/login | Admin Login |
| http://localhost:5173/admin | Admin Dashboard |
| http://localhost:3001/api/announcements | API Endpoint |

---

## 🔐 Admin Credentials

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TailwindCSS |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| Database | JSON file (announcements.db.json) |
| Auth | JWT (jsonwebtoken) + bcryptjs |

---

## 📁 Project Structure

```
community-announcements/
├── backend/
│   ├── server.js              # Express API server
│   ├── announcements.db.json  # Auto-created data store
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Public announcement board
│   │   │   ├── AdminLogin.jsx     # Login page
│   │   │   └── AdminDashboard.jsx # Full admin panel
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── AnnouncementCard.jsx
│   │   │   ├── AnnouncementModal.jsx
│   │   │   ├── AnnouncementForm.jsx
│   │   │   └── SubscribeForm.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # JWT auth state
│   │   ├── api.js                 # API fetch utility
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── start.sh                   # One-command startup
└── README.md
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/announcements` | No | List all (filter: `?category=events`) |
| GET | `/api/announcements/:id` | No | Get single + increment views |
| POST | `/api/subscribe` | No | Subscribe email |
| POST | `/api/admin/login` | No | Get JWT token |
| GET | `/api/admin/announcements` | JWT | All announcements |
| POST | `/api/admin/announcements` | JWT | Create announcement |
| PUT | `/api/admin/announcements/:id` | JWT | Update announcement |
| DELETE | `/api/admin/announcements/:id` | JWT | Delete announcement |
| GET | `/api/admin/subscribers` | JWT | All subscribers |
| GET | `/api/admin/analytics` | JWT | Analytics summary |

---

## 🎨 Design

The platform uses a **refined editorial aesthetic**:
- **Playfair Display** (serif display font) for headings
- **DM Sans** for body text
- **Forest green** primary palette with amber accents
- Warm cream background with subtle grain texture
- Staggered card animations on load
