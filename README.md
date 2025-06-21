# 🔐 JWT Login App

A full-stack web application demonstrating modern authentication and role-based access control using **JWT (JSON Web Tokens)**. The app includes user signup, login, profile management, and an admin panel with the ability to manage users.

![App Screenshot](https://github.com/amitsaxena-softdev/JWT-Login-App/blob/a68bb8335218c65c013092eff25879bcfcfee86a/client/src/assets/screenshot.png)

---

## 🚀 Features

- ✅ Secure user authentication using JWT
- ✅ Role-based access: User vs. Admin
- ✅ Admin dashboard with user listing and delete actions
- ✅ Profile page with user info
- ✅ Modern UI with Material UI v6 and responsive layout
- ✅ Theme customization and dark mode support

---

## 🖼️ Tech Stack

| Layer     | Technology                |
|-----------|---------------------------|
| Frontend  | React (Vite) + TypeScript |
| UI        | Material UI (v6)          |
| Backend   | Node.js + Express.js      |
| Auth      | JWT (jsonwebtoken)        |
| Database  | MongoDB (via Mongoose)    |

---

## 📦 Installation

### Prerequisites

- Node.js ≥ 18.x
- MongoDB (local or Atlas)
- Yarn or npm

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/amitsaxena-softdev/JWT-Login-App.git
cd jwt-login-app
```

### 2. Backend Setup

```bash
cp .env.example .env
```
Edit the .env file and fill in:
```bash
PORT=3001
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<yourSecretKeyHere>
````
Then install and run the server:
```bash
cd server
npm install
npm run dev
```
### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
````
Now open the app in your browser:
http://localhost:5173

---

# 📁 Project Structure
```bash
client/                        # React frontend (Vite + MUI)
│
└───src/
    ├───components/            # Reusable UI components
    ├───Dashboard/             # Dashboard view & logic
    ├───shared-theme/          # Global MUI theme customization
    ├───SignIn/                # Login & SignUp views
    ├───types/                 # Shared TypeScript interfaces & types
    └───utils/                 # Utility functions (e.g., form validation)

server/                        # Express backend (JWT Auth + MongoDB)
├───Controllers/               # Business logic for each route
├───Routers/                   # Route definitions and endpoints
├───Models/                    # Mongoose models / schemas
└───server.js                  # Entry point of the backend app

.env.example                   # Template for required environment variables
```
# 🔐 User Roles
* **User:** Can view own profile, delete own account

* **Admin:** Can view all users, delete any user via admin panel

# 🧪 API Endpoints

| Method | Endpoint                   | Description                    |
| ------ | -------------------------- | ------------------------------ |
| POST   | `/auth/signup`             | Register new user              |
| POST   | `/auth/login`              | Authenticate and receive token |
| GET    | `/user/profile`            | Fetch current user profile     |
| DELETE | `/user/deleteUser`         | Delete own account             |
| GET    | `/admin/getAllUsers`       | Admin fetches all users        |
| DELETE | `/admin/deleteUserByAdmin` | Admin deletes any user         |

# 📌 To-Do / Future Improvements
- [ ] Password reset functionality

- [ ] Email verification system

- [ ] Pagination/filtering in admin panel

- [ ] Audit logging for user actions

- [ ] Responsive improvements for mobile

# 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you want to change.
