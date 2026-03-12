# BuildTrack — Construction Field Management App

A responsive React.js web application for managing construction projects and submitting Daily Progress Reports (DPR).

![BuildTrack Preview](./preview.png)

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.2.0 | UI Framework |
| React Router DOM | 6.22.0 | Client-side routing |
| Vite | 5.1.0 | Build tool & dev server |
| CSS Modules | — | Component-scoped styling |
| Axios | 1.6.7 | HTTP client (ready for real API) |

**Fonts:** Barlow Condensed + Barlow (Google Fonts)  
**No Tailwind** — custom design system using CSS variables and CSS Modules for full control.

---

## Features Implemented

### ✅ Login Screen
- Email + password authentication
- Mock credentials: `test@test.com` / `123456`
- Client-side validation (email format, min password length)
- Descriptive error messages for both field errors and auth failure
- Show/hide password toggle
- Simulated async login (900ms delay)
- Session persistence via `sessionStorage`

### ✅ Project List Screen
- 5 hard-coded projects with Name, Status badge, Start Date, Location, Budget, Progress, Manager
- Color-coded status badges (Active, Planning, Delayed, Completed, On Hold)
- Progress bars with status-appropriate colors
- Click any project card to open DPR form for that project
- **Bonus:** Real-time search (name, location, manager)
- **Bonus:** Filter by status (buttons + stat cards)
- Animated card entrance with staggered delay

### ✅ DPR Form Screen
- Project dropdown (pre-filled if navigated from project card)
- Date picker (max: today, cannot submit future dates)
- Weather dropdown (7 conditions with emoji)
- Work description textarea (min 20 chars, max 2000 chars, live character counter)
- Worker count with +/- increment buttons
- Photo upload: drag-and-drop or click-to-browse, 1–3 images, preview thumbnails, remove button
- Full validation with descriptive error messages
- Success toast notification with report ID
- Sidebar with selected project details
- Tips panel for report writing guidance

### ✅ Responsive Design
- Mobile-first (375px base)
- Tablet (768px) and Desktop (1280px+) breakpoints
- No horizontal scroll on any viewport
- Sticky navbar with mobile hamburger menu

### ✅ Bonus Features
- **Dark/Light mode toggle** (persists in localStorage)
- **Project filter by status** (clickable stat cards + filter buttons)
- **Animated transitions** (fade-in, slide-in, staggered lists)
- **DPR persistence** (saved to localStorage, not reset on page refresh)

---

## What's Not Implemented

- Real backend / API calls (all data is mocked)
- User registration / password reset
- DPR history / view past reports screen
- Image upload to a real server (previews only, base64 in memory)
- Real-time collaboration

---

## Known Issues / Limitations

- Photos are held in component state and not persisted to localStorage (base64 can be large)
- Session expires on browser close (sessionStorage)
- No real authentication — any input matching `test@test.com / 123456` succeeds
- Date input styling varies across browsers (Chrome vs Firefox vs Safari)

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky nav with mobile drawer & theme toggle
│   ├── Navbar.module.css
│   ├── Toast.jsx           # Animated success/error notifications
│   └── Toast.module.css
├── context/
│   ├── AuthContext.jsx     # Auth state (login, logout, user)
│   └── ThemeContext.jsx    # Dark/light mode
├── constants/
│   └── index.js            # Projects data, status labels, weather options
├── pages/
│   ├── Login.jsx
│   ├── Login.module.css
│   ├── ProjectList.jsx
│   ├── ProjectList.module.css
│   ├── DPRForm.jsx
│   └── DPRForm.module.css
├── utils/
│   └── index.js            # Validation, date formatting, file utils
├── App.jsx                 # Router setup, protected routes
├── main.jsx                # Entry point
└── index.css               # Global design system (CSS variables, base styles)
```

---

## Setup & Running Locally

### Prerequisites
- Node.js 18+ (check: `node --version`)
- npm 9+ (check: `npm --version`)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/construction-field-management.git
cd construction-field-management

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build:

```bash
npm run preview
```

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to [vercel.com](https://vercel.com) for automatic deployments.

---

## Demo Credentials

| Field | Value |
|-------|-------|
| Email | `test@test.com` |
| Password | `123456` |

---

## Design System

The app uses an **Industrial Field Command** aesthetic:
- **Primary font:** Barlow Condensed (headings, labels, badges)
- **Body font:** Barlow (body text, inputs)
- **Color palette:** Dark steel green backgrounds with amber (`#f59e0b`) accents
- **Light mode** available via toggle in navbar
- All colors defined as CSS custom properties in `index.css`
