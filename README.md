# 🚀 CRM Software (Full-Stack Project)

## 📌 Overview
This is a full-stack Customer Relationship Management (CRM) system designed to manage customers, leads, tasks, and sales pipelines in a centralized platform. It improves business productivity and customer engagement.

---

## 🛠️ Tech Stack
- Backend: Java (Spring Boot)
- Frontend: React.js
- Database: MySQL
- Authentication: JWT + Spring Security
- API Docs: Swagger (OpenAPI)

---

## 🔐 Features

### 👤 User Management
- Register & Login users
- JWT authentication
- Role-based access (Admin / Sales)

### 👥 Customer Management
- Add, update, delete customers
- Store customer details and assign sales reps

### 📊 Lead Management
- Track leads and update status
- Assign leads to sales reps

### ✅ Task Management
- Create and manage tasks
- Track status and priorities

### 💰 Sales Management
- Manage sales pipeline
- Track deal status and revenue

---

## 🗂️ Project Structure

### Backend
crm-backend/
├── controller/
├── service/
├── repository/
├── model/
├── security/
├── dto/
└── application.properties


### Frontend

crm-frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── utils/
│ └── App.js


---

## ⚙️ Setup Instructions

### Backend
```bash
cd crm-backend
mvn clean install
mvn spring-boot:run
Frontend
cd crm-frontend
npm install
npm start
