# 🎓 Student Management System (Full Stack)

A production-level **role-based student management system** built with modern technologies.
This system enables **admins, teachers, and students** to interact with academic data securely and efficiently.

---

## 🚀 Features

### 🔐 Authentication & Security

* JWT-based authentication using **HTTP-only cookies**
* Role-based and **permission-based access control (RBAC)**
* Secure password hashing with bcrypt

---

### 👨‍💼 Admin

* Create and manage teachers
* Assign classes (year, section) to teachers

---

### 👨‍🏫 Teacher

* Create student accounts (auto password using DOB)
* Manage students within assigned classes only
* Mark attendance (single + bulk)
* View attendance reports

---

### 👨‍🎓 Student

* View personal attendance
* View attendance percentage

---

### 📊 Attendance System

* Bulk attendance marking
* Filter by:

  * Student
  * Class (year + section)
  * Date range
* Attendance percentage calculation
* Duplicate prevention using database indexing

---

## 🛠️ Tech Stack

### Backend

* Node.js + Express.js
* MongoDB + Mongoose
* Zod (validation)
* JWT (authentication)
* RBAC (custom permission system)

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS

---

## 🧠 Architecture

```text
Client → API Routes → Middleware → Controller → Service → Database
```

### Key Concepts Used:

* Clean architecture (separation of concerns)
* Middleware chaining (Auth + Permissions)
* Service layer abstraction
* Scalable RBAC system

---

## 📁 Project Structure

### Backend

```text
src/
 ├── controllers/
 ├── services/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── validators/
 ├── utils/
```

### Frontend

```text
src/
 ├── app/
 ├── components/
 ├── features/
 ├── lib/
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/sms-backend.git
cd sms-backend
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smsDB
JWT_SECRET=your_secret_key
```

---

### 4. Run Server

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd sms-frontend
npm install
npm run dev
```

---

## 📡 API Overview

### Auth

* POST `/api/auth/login`
* POST `/api/auth/logout`

### Students

* POST `/api/students`
* GET `/api/students`
* PUT `/api/students/:id`
* DELETE `/api/students/:id`

### Teachers

* POST `/api/teachers`
* PUT `/api/teachers/assign/:id`

### Attendance

* POST `/api/attendance/bulk`
* GET `/api/attendance`
* GET `/api/attendance/report/:studentId`

---

## 📊 Key Highlights

* ✅ Permission-based RBAC (not just roles)
* ✅ Bulk database operations (insertMany)
* ✅ Indexed queries for performance
* ✅ Secure cookie-based authentication
* ✅ Clean and scalable backend architecture

---

## 🔮 Future Improvements

* Refresh token implementation
* Redis caching
* File upload (student profile images)
* Real-time attendance (WebSockets)
* Deployment with Docker