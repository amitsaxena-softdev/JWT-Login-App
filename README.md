# JWT Login App

A modern, secure authentication system built with React, Node.js, and MongoDB. Features JWT-based authentication, role-based access control, and a responsive Material-UI interface.

![JWT Login App Screenshot](https://github.com/amitsaxena-softdev/JWT-Login-App/blob/cc1ab4a6f22c007d8e033022d9d67806818ca590/client/public/JWT%20Screenshot.png)

## 🚀 Features

### Authentication & Security
- **JWT Token Authentication** with secure token validation
- **Password Hashing** using bcrypt with 12 salt rounds
- **Token Blacklisting** for secure logout functionality
- **Client & Server-side Token Validation**
- **Session & Local Storage** token management
- **CORS Protection** with configurable origins

### User Management
- **User Registration** with comprehensive validation
- **Role-based Access Control** (User/Admin)
- **Profile Management** with user information display
- **Account Deletion** with confirmation dialogs
- **Admin Panel** for user management (admin users only)

### Frontend Features
- **Responsive Design** with Material-UI components
- **Dark/Light Theme** support
- **Tab-based Navigation** for different sections
- **Loading States** and error handling
- **Snackbar Notifications** for user feedback
- **Form Validation** with real-time feedback

### Backend Features
- **RESTful API** with proper HTTP status codes
- **Input Validation** and sanitization
- **Error Handling** with detailed error messages
- **Database Connection** monitoring
- **Health Check Endpoint** for monitoring
- **Security Headers** implementation

## 📁 Project Structure

```
JWT-Login-App/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── Dashboard/               # Dashboard components
│   │   ├── SignIn/                  # Authentication components
│   │   ├── shared-theme/            # Shared UI components
│   │   ├── types/                   # TypeScript definitions
│   │   ├── utils/                   # Utility functions
│   │   └── main.jsx                 # App entry point
│   └── package.json
├── server/                          # Node.js Backend
│   ├── Controllers/                 # Business logic
│   ├── Models/                      # Database models
│   ├── Routers/                     # API routes
│   ├── server.js                    # Server entry point
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | React | 18.x | UI framework |
| | Material-UI (MUI) | 5.x | Component library |
| | React Router | 6.x | Client-side routing |
| | Vite | 6.x | Build tool & dev server |
| | TypeScript | 5.x | Type safety |
| **Backend** | Node.js | 18+ | Runtime environment |
| | Express.js | 4.18.2 | Web framework |
| | MongoDB | 6+ | Database |
| | Mongoose | 7.x | ODM for MongoDB |
| | JWT | 9.x | Token-based authentication |
| | bcrypt | 5.x | Password hashing |
| | CORS | 2.8.x | Cross-origin resource sharing |

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JWT-Login-App
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/jwt-login-app
   PORT=3001
   JWT_SECRET_KEY=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from server directory)
   npm start

   # Start frontend dev server (from client directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response | Auth Required |
|--------|----------|-------------|--------------|----------|---------------|
| `POST` | `/auth/login` | User login | `{ "username": "user@example.com", "password": "password123" }` | `{ "success": true, "message": "Login successful!", "token": "jwt_token", "user": {...} }` | ❌ |
| `POST` | `/auth/signup` | User registration | `{ "username": "newuser", "password": "password123", "role": "user", "firstName": "John", "lastName": "Doe", "email": "john@example.com", "gender": "male" }` | `{ "success": true, "message": "User created successfully" }` | ❌ |
| `POST` | `/auth/logout` | User logout | - | `{ "success": true, "message": "Logout successful" }` | ✅ |
| `GET` | `/auth/checkToken` | Validate token | - | `{ "success": true, "message": "Token is valid", "user": {...} }` | ✅ |

### User Endpoints

| Method | Endpoint | Description | Request Body | Response | Auth Required |
|--------|----------|-------------|--------------|----------|---------------|
| `GET` | `/user/profile` | Get user profile | - | `{ "success": true, "data": { "user": {...} } }` | ✅ |
| `DELETE` | `/user/deleteUser` | Delete user account | - | `{ "success": true, "message": "User deleted successfully" }` | ✅ |

### Admin Endpoints

| Method | Endpoint | Description | Request Body | Response | Auth Required |
|--------|----------|-------------|--------------|----------|---------------|
| `GET` | `/admin/getAllUsers` | Get all users | - | `{ "success": true, "data": { "users": [...] } }` | ✅ (Admin) |
| `DELETE` | `/admin/deleteUserByAdmin` | Delete user by admin | `{ "userId": "user-id-to-delete" }` | `{ "success": true, "message": "User deleted successfully" }` | ✅ (Admin) |

### Response Data Structures

#### User Object
```json
{
  "_id": "string",
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "user" | "admin",
  "gender": "male" | "female",
  "phone": "string",
  "aboutUser": "string",
  "createdAt": "string",
  "settings": {
    "newsletter": "boolean"
  }
}
```

#### Standard Response Format
```json
{
  "success": "boolean",
  "message": "string",
  "data": "object (optional)",
  "error": "string (optional)"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Invalid/missing token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found |
| `409` | Conflict - Resource already exists |
| `500` | Internal Server Error |

## 🔒 Security Features

### Authentication Security
- **JWT Tokens** with 1-hour expiration
- **Token Blacklisting** for secure logout
- **Password Hashing** with bcrypt (12 salt rounds)
- **Input Validation** and sanitization
- **CORS Protection** with configurable origins

### Data Protection
- **No Sensitive Data** in JWT payloads
- **Secure Headers** (XSS, CSRF protection)
- **Request Size Limits** (10MB max)
- **Error Message Sanitization** in production

### Best Practices
- **Environment Variables** for configuration
- **Proper HTTP Status Codes**
- **Comprehensive Error Handling**
- **Input Validation** on both client and server
- **Database Connection Monitoring**

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-first** approach
- **Breakpoint-based** layouts
- **Flexible Grid System**

### Theme Support
- **Dark/Light Mode** toggle
- **Custom Color Palette**
- **Consistent Typography**

### User Experience
- **Loading States** for async operations
- **Error Handling** with user-friendly messages
- **Form Validation** with real-time feedback
- **Confirmation Dialogs** for destructive actions

## 🧪 Development Guidelines

### Code Structure
- **Component-based** architecture
- **Separation of Concerns** (MVC pattern)
- **Modular File Organization**
- **Consistent Naming Conventions**

### Code Quality
- **Comprehensive Comments** and documentation
- **Type Safety** (TypeScript interfaces)
- **Error Handling** at all levels
- **Consistent Code Formatting**

### Testing
- **API Testing** with REST client
- **Manual Testing** workflows
- **Error Scenario** testing

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd server
npm install --production
# Set NODE_ENV=production
# Deploy to your hosting service
```

### Environment Variables for Production
```env
MONGO_URI=your-production-mongodb-uri
PORT=3001
JWT_SECRET_KEY=your-production-secret-key
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the code comments for implementation details

## 🔄 Version History

- **v1.0.0** - Initial release with basic authentication
- **v1.1.0** - Added admin panel and user management
- **v1.2.0** - Improved code structure and documentation
- **v1.3.0** - Enhanced security features and error handling