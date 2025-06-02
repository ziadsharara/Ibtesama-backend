# 🦷 Ibtesama - Dental Clinic Management System

**Ibtesama** is a comprehensive dental clinic management ecosystem built to streamline clinic operations, enhance patient experience, and empower clinic staff with powerful tools and real-time data access.

This full-stack project includes:
- A **React Admin Dashboard** for internal clinic management.
- A **Next.js Website** for patient-facing services like online appointment booking.
- A **React Native Mobile App** for doctors to manage appointments on the go.
- A **Node.js Backend** that powers the entire system via RESTful APIs.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT-based auth system with role-based access control
- **Frontend**: 
  - React (Admin Dashboard)
  - Next.js (Public Website)
  - React Native (Doctor Mobile App)

---

## 📁 Project Phases

### 📌 Phase 01: Admin Dashboard (React)
Internal system for admins, doctors, and receptionists to manage:
- Patients and appointments
- Medical records and treatment plans
- Lab orders and inventory
- Finances and payments

#### 👥 Roles & Permissions
- **Admin**: Full access. Can manage users, appointments, finances, etc.
- **Doctor**: Manage own appointments and patients. Access lab files and inventory orders.
- **Receptionist**: Handle contact info, appointments, lab and inventory orders.

#### 🔄 Core Features
- Auth (Login, Role-based access)
- Appointments (CRUD + status)
- Patients (Profiles, dental charts, history, X-rays)
- Labs (Orders, statuses, payments)
- Inventory (Supplies, suppliers, stock management)
- Finances (Payments tracking, summaries)

---

### 🌐 Phase 02: Public Website (Next.js)
- Real-time appointment scheduling with doctors
- Information about services, doctors, and clinic location
- Contact form and inquiry management

---

### 📱 Phase 03: Mobile App (React Native)
- A lightweight app for doctors to manage appointments, view patient data, and track treatments from their phones.

---

### 🧠 Phase 04: Future Enhancements
- AI-powered X-ray analysis
- Patient portal to access medical history and payments
- Automated reminders (SMS, WhatsApp, Email)

---

## 🧩 Data Structure & APIs

The system is designed with modular REST APIs including:

- `/auth/login`
- `/api/users/me`
- `/api/appointments`
- `/api/patients`
- `/api/labs` and `/api/labs/orders`
- `/api/inventory/supplies`, `/suppliers`, `/orders`
- `/api/finances/*`

All API responses follow consistent data models and are authenticated via bearer tokens.

---

## 📌 Status

> 🚧 Phase 01 (Backend + Admin Dashboard) is in active development.
