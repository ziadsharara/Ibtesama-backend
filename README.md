# 🦷 Ibtesama - Dental Clinic Management System

**Ibtesama** is a full-stack dental clinic management system. This repository contains the **Back-End** services built using **Node.js** and **Express**, providing a robust and scalable RESTful API for managing all aspects of a dental clinic's operations.

---

## ⚙️ Backend Overview

This API powers three separate frontends:
- **Admin Dashboard** (React)
- **Patient Website** (Next.js)
- **Doctor Mobile App** (React Native)

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (`admin`, `doctor`, `receptionist`)

---

## 🗂️ API Modules & Responsibilities

### 🧑‍⚕️ Users & Roles
- Create and manage users (Admin, Doctor, Receptionist)
- Role assignment and access control
- Protected routes based on role

### 📅 Appointments
- CRUD operations for appointment scheduling
- Status tracking (e.g., pending, confirmed, completed)
- Filtering by date, doctor, patient

### 👥 Patients
- Full patient profiles
- Dental charts and X-rays
- Medical history and visit records

### 🧪 Labs
- Lab order creation and tracking
- Payment status for lab services

### 📦 Inventory
- Manage supplies and suppliers
- Stock tracking and order requests

### 💰 Finances
- Handle patient payments
- Clinic revenue summaries and reports

---

## 🧱 Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Multer** for file uploads (X-rays, images)
- **Express Validator** for request validation
- **RESTful API** structure

---

## 📐 Schema Design

- Carefully structured MongoDB collections to separate responsibilities:
  - `users`, `patients`, `appointments`, `labs`, `inventoryItems`, `suppliers`, `payments`
- Relationships managed via object references
- Scalable and modular folder architecture

---

## 🧪 API Sample Endpoints

```http
POST   /api/auth/login
GET    /api/users/me
POST   /api/appointments
PATCH  /api/appointments/:id/status
POST   /api/patients
GET    /api/inventory/supplies
POST   /api/labs/orders
```

All endpoints are secured using JWT authentication and role-based access filters.

📌 Project Status
🚧 Backend development is currently in progress — schema design, models, and core routes are under implementation.


