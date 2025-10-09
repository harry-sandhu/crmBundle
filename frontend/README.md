---

##  **Frontend README — `bundle-maker/frontend/README.md`**

```markdown
#  Frontend — React + Tailwind + TypeScript

Frontend for **Bundle Maker**, providing all user-facing pages for browsing products, creating bundles, and managing submissions.

---

##  Tech Stack
- React + TypeScript  
- Tailwind CSS  
- Zustand (state management)  
- React Router DOM  
- React Hook Form  
- Axios  

---

##  Setup Instructions

```bash
cd frontend
npm install
npm run dev
App runs at:
 http://localhost:5173

 Environment Variables
Create .env in /frontend:


VITE_API_URL=http://localhost:5000/api

## Folder Structure
bash
Copy code
src/
├── main.tsx
├── App.tsx
│
├── components/
│   ├── Header.tsx         # Logo, Catalog, Bundle Maker, Account
│   ├── Footer.tsx         # Contact and policy links
│   ├── ProductCard.tsx    # Product display card
│   ├── BundleSidebar.tsx  # Live bundle view
│   ├── ProtectedRoute.tsx # Auth guard for private pages
│
├── layouts/
│   ├── MainLayout.tsx     # Header + Footer layout
│   └── AdminLayout.tsx    # Admin dashboard layout
│
├── pages/
│   ├── Auth/
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── ForgotPassword.tsx
│   │
│   ├── Landing/
│   │   └── Catalog.tsx    # Product browsing page
│   │
│   ├── User/
│   │   └── Dashboard.tsx  # Profile, bundles, submissions
│   │
│   ├── BundleMaker/
│   │   ├── CreateBundle.tsx
│   │   └── ReviewSubmit.tsx
│   │
│   └── Admin/
│       └── AdminPanel.tsx  # Manage bundles/products/users
│
├── routes/
│   └── AppRoutes.tsx       # Defines routes with role protection
│
├── store/
│   └── useStore.ts         # Zustand global state
│
├── utils/
│   └── api.ts              # Axios base instance
│
└── types/
    └── index.ts            # Shared interfaces
### Key Pages
Page	Description
/login, /signup	Authentication
/catalog	Browse and add products
/bundle/create	Create new bundle
/bundle/review	Review & submit bundle
/dashboard	User profile and bundles
/admin	Admin panel

### Scripts
Command	Description
npm run dev	Run development server
npm run build	Build production
npm run preview	Preview build

### Notes
Uses Tailwind for UI layout.

All API requests use VITE_API_URL.