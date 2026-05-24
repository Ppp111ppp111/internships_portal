# InternCrack — Internship Search Portal

A production-ready React application that replicates a professional internship search experience (inspired by Internshala). It features client-side filtering, sorting, responsive design, dark mode, and a polished UI built with modern React patterns and Tailwind CSS v4.

## Features

- **Live Search & Filtering:** Filter internships by profile, location, stipend, and duration.
- **Client-Side Sorting:** Sort by relevance, newest, highest stipend, or shortest duration.
- **Responsive Design:** Optimized for both desktop and mobile with a sleek drawer UI for mobile filters.
- **Dark Mode Support:** Seamless toggling between light and dark themes using CSS variables.
- **Saved Internships:** Bookmark internships using `localStorage` persistence.
- **Modern UI:** Built using standard CSS transitions, custom bespoke theme tokens, and Lucide icons.roll** — Smooth lazy loading via IntersectionObserver — no pagination buttons
- **Dark Mode** — System-aware toggle with localStorage persistence
- **Saved Internships** — Bookmark internships with a single click, stored in localStorage
- **Sort Options** — Sort by relevance, stipend (high/low), or duration
- **Responsive Design** — Fully responsive across mobile, tablet, and desktop
- **Mobile Filter Drawer** — Slide-up bottom sheet for filters on small screens
- **Loading Skeletons** — Shimmer-animated placeholder cards during data fetch
- **Active Filter Chips** — Visual tags with one-click removal


## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI library |
| React Router 7 | Client-side routing + search params |
| Axios | HTTP client for API calls |
| Tailwind CSS 4 | Utility-first styling |
| Framer Motion | Animations and layout transitions |
| Lucide React | Icon library |
| Vite | Build tool and dev server |

## Folder Structure

```
src/
├── components/
│   ├── Navbar/
│   │   └── Navbar.jsx
│   ├── Filters/
│   │   ├── FilterSidebar.jsx
│   │   ├── FilterSection.jsx
│   │   ├── FilterChips.jsx
│   │   └── MobileFilterDrawer.jsx
│   ├── InternshipCard/
│   │   └── InternshipCard.jsx
│   ├── Loader/
│   │   └── SkeletonCard.jsx
│   └── EmptyState/
│       └── EmptyState.jsx
├── pages/
│   └── SearchPage.jsx
├── hooks/
│   ├── useInternships.js
│   ├── useDebounce.js
│   └── useSavedInternships.js
├── services/
│   └── api.js
├── utils/
│   ├── filters.js
│   └── constants.js
├── context/
│   └── ThemeContext.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/internship-portal.git
cd internship-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## Deployment (Vercel)

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select your repo
4. Vercel auto-detects Vite — no config needed
5. Click **Deploy**

The app uses `BrowserRouter`, so Vercel's default SPA fallback handles client-side routing automatically.

## Screenshots

> Screenshots to be added after deployment.

## Challenges Faced

- **CORS restrictions** — The Internshala API blocks direct browser requests. Solved with a CORS proxy fallback (AllOrigins) so the app works without a custom backend.
- **Data normalization** — The API returns an object keyed by ID rather than an array. Built a normalizer in the service layer to transform it into a clean, consistent shape.
- **Filter performance** — With all filtering happening client-side, memoization (`useMemo`) and debouncing are essential to keep the UI responsive. Each filter function is pure and composable.
- **Mobile UX** — Sidebar filters don't work on mobile. Built a full-height slide-up drawer with Framer Motion spring animations for a native-app feel.

## Future Improvements

- [ ] Add individual internship detail page with expanded info
- [ ] Implement "Recently Viewed" section with sessionStorage
- [ ] Add filter by work type (Remote / In-office / Hybrid)
- [ ] Server-side rendering with Next.js for SEO
- [ ] Unit tests with Vitest and React Testing Library
- [ ] Accessibility audit and ARIA improvements
- [ ] PWA support with service worker caching

## License

MIT
