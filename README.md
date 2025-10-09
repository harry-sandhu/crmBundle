# Bundle Maker

## Description

**Bundle Maker** is a full-stack web application developed as a commissioned project for a client.  
It allows users to browse products, create personalized bundles, and submit them for admin review.  
Admins can manage users, products, and submissions through a dedicated admin panel.



## Table of Contents

- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Core Features](#core-features)
- [Data Model Overview](#data-model-overview)
- [Credits](#credits)
- [License](#license)

---

## Tech Stack

### Frontend
- React 18 + TypeScript  
- Tailwind CSS  
- Zustand (state management)  
- React Router DOM  
- Axios  
- React Hook Form  

### Backend
- Node.js + Express  
- MongoDB + Mongoose  
- TypeScript  
- JWT Authentication  
- Nodemailer or EmailJS for admin notifications  

---

## Folder Structure

bundle-maker/
│
├── README.md # Main project overview (this file)
├── .gitignore # Global git ignore file
│
├── backend/ # Backend code and APIs
│ ├── README.md
│ ├── package.json
│ ├── tsconfig.json
│ ├── src/
│ │ ├── server.ts
│ │ ├── config/
│ │ │ └── db.ts
│ │ ├── models/
│ │ │ ├── userModel.ts
│ │ │ ├── productModel.ts
│ │ │ └── bundleModel.ts
│ │ ├── controllers/
│ │ │ ├── authController.ts
│ │ │ ├── productController.ts
│ │ │ └── bundleController.ts
│ │ ├── routes/
│ │ │ ├── authRoutes.ts
│ │ │ ├── productRoutes.ts
│ │ │ └── bundleRoutes.ts
│ │ ├── middlewares/
│ │ │ ├── authMiddleware.ts
│ │ │ └── errorMiddleware.ts
│ │ └── utils/
│ │ └── emailService.ts
│ └── .env.example
│
└── frontend/ # React app
├── README.md
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── src/
├── main.tsx
├── App.tsx
├── components/
│ ├── Navbar.tsx
│ ├── ProductCard.tsx
│ ├── BundleBuilder.tsx
│ └── DashboardCard.tsx
├── layouts/
│ ├── UserLayout.tsx
│ └── AdminLayout.tsx
├── pages/
│ ├── Home.tsx
│ ├── Login.tsx
│ ├── Register.tsx
│ ├── Dashboard.tsx
│ ├── BundleBuilder.tsx
│ └── AdminPanel.tsx
├── routes/
│ ├── index.tsx
│ └── ProtectedRoute.tsx
├── store/
│ └── useStore.ts
└── utils/
├── api.ts
└── helpers.ts

yaml
Copy code

---

## Installation

### 1. Clone the Repository
```bash
git clone <repo-url>
cd bundle-maker
2. Setup Backend

cd backend
cp .env.example .env
npm install
npm run dev
Backend runs at: http://localhost:5000

3. Setup Frontend

cd ../frontend
npm install
npm run dev
Frontend runs at: http://localhost:5173

#### Usage
Start both backend and frontend servers.
Visit the frontend URL (http://localhost:5173).
Register or log in as a user.
Browse products and add them to a bundle.
Adjust quantities, add notes, and save or submit the bundle.
Admin can log in to the admin panel to manage bundles, products, and users.
To add screenshots, create an assets/images folder and use:


#### Core Features
Authentication
User registration and login using JWT
Password hashing for security
Forgot password support (email verification)
Product Catalog
Browse and filter by category
Search functionality
Add items directly to bundles

#### Bundle Builder
Add and adjust product quantities
Auto-calculate total bundle price
Save as draft or submit for review

#### User Dashboard
View profile and saved bundles
Track submitted bundles

#### Admin Panel
Manage users, products, and categories
Review user bundle submissions
Leave notes and update bundle status

Data Model Overview
Entity	Fields
User	id, name, email, password, role (user/admin), createdAt
Product	id, title, description, price, category, image
Bundle	id, ownerId, items[{ productId, qty }], notes, status, createdAt
Submission	id, bundleId, submittedAt, adminNotes


Technologies: React, Tailwind CSS, TypeScript, Node.js, Express, MongoDB


#### Features
Modern responsive UI built with Tailwind CSS
Secure full-stack authentication with JWT
Modular and scalable TypeScript backend
State management with Zustand
RESTful API integration with Axios
Email notifications via Nodemailer or EmailJS

