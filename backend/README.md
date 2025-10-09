
---

##  **Backend README — `bundle-maker/backend/README.md`**

```markdown
#  Backend — Node.js + Express + MongoDB + TypeScript

Backend for **Bundle Maker**, managing user authentication, products, bundles, and admin workflows.

---

##  Tech Stack
- Node.js + Express  
- MongoDB + Mongoose  
- TypeScript  
- JWT Authentication  
- Nodemailer (or EmailJS)  
- dotenv + CORS  

---

##  Setup Instructions

```bash
cd backend
npm install
cp .env.example .env
npm run dev
Server runs at:
 http://localhost:5000

 Environment Variables
.env:


PORT=5000
MONGO_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password
 Folder Structure

src/
├── server.ts               # Entry point — starts Express app
│
├── config/
│   └── db.ts               # MongoDB connection
│
├── models/
│   ├── User.ts             # id, name, email, role, password
│   ├── Product.ts          # id, title, price, category
│   ├── Bundle.ts           # ownerId, items, notes, status, createdAt
│   └── Submission.ts       # bundleId, submittedAt, adminNotes
│
├── controllers/
│   ├── authController.ts   # signup, login, forgot password
│   ├── productController.ts# CRUD for products
│   ├── bundleController.ts # create/update/submit bundles
│   ├── submissionController.ts # admin bundle reviews
│   └── userController.ts   # profile and user data
│
├── routes/
│   ├── authRoutes.ts
│   ├── productRoutes.ts
│   ├── bundleRoutes.ts
│   ├── submissionRoutes.ts
│   └── userRoutes.ts
│
├── middlewares/
│   ├── authMiddleware.ts   # JWT verification
│   └── errorHandler.ts     # Global error handling
│
├── utils/
│   └── sendEmail.ts        # Sends email on submission
│
└── types/
    └── index.d.ts          # Shared TS types
### Core API Routes
Method	Endpoint	Description
POST	/api/auth/signup	Create user
POST	/api/auth/login	Login user
GET	/api/products	Get all products
POST	/api/bundles	Create bundle
POST	/api/submissions	Submit bundle
GET	/api/admin/bundles	Admin: view bundles

### Data Models
User
ts
Copy code
{ id, name, email, role: "user" | "admin", password }
Product
ts
Copy code
{ id, title, price, category }
Bundle
ts
Copy code
{ id, ownerId, items[{productId, qty}], notes, status, createdAt }
Submission
ts
Copy code
{ id, bundleId, submittedAt, adminNotes }
### Scripts
Command	Description
npm run dev	Start dev server
npm run build	Compile TypeScript
npm start	Run compiled build