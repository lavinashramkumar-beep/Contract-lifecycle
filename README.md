# Contract Lifecycle Management Platform

A full-stack MERN application for managing contracts, approvals, renewals, compliance, vendors, notifications and activity history.

## Stack
- React + Vite
- Express + Node.js
- MongoDB + Mongoose
- JWT + bcryptjs
- Recharts
- Multer
- node-cron

## Requirements
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

## Setup

### 1. Install
From the project root:

```bash
npm install
npm run install-all
```

Or separately:

```bash
cd server
npm install
cd ../client
npm install
```

### 2. Environment
Copy `.env.example` to `server/.env` and update values.

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/contract_lifecycle
JWT_SECRET=change_this_secret
CLIENT_URL=http://localhost:5173
```

### 3. Seed sample data

```bash
cd server
npm run seed
```

### 4. Start

From root:

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## Demo credentials

- Admin: admin@example.com / Admin@123
- Contract Manager: manager@example.com / Manager@123
- Approver: approver@example.com / Approver@123
- Viewer: viewer@example.com / Viewer@123

## Main features

- JWT login and registration
- Role-based access
- Contract CRUD
- Contract lifecycle status tracking
- Approval and rejection workflow
- Automated expiry and renewal reminders
- Renewal history
- Vendor management and performance
- Compliance tracking
- Notifications
- Activity log
- Contract document upload
- Search and filtering
- Dashboard charts
- CSV reports
