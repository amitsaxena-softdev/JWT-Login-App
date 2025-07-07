const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

// Import route modules
const userRouter = require("./Routers/userRouter");
const adminRouter = require("./Routers/adminRouter");
const authRouter = require("./Routers/authRouter");

/**
 * Express Application Setup
 * 
 * Main server configuration and initialization.
 * Handles database connection, middleware setup, and route registration.
 */
const app = express();

/**
 * Environment Configuration
 * 
 * Loads environment variables and validates required configuration.
 * Throws error if critical environment variables are missing.
 */
const validateEnvironment = () => {
  const requiredEnvVars = ['MONGO_URI', 'PORT', 'JWT_SECRET_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

/**
 * Database Connection Setup
 * 
 * Establishes connection to MongoDB using Mongoose.
 * Includes connection event handlers for monitoring and error handling.
 */
const setupDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
    
    // Monitor database connection events
    mongoose.connection.on('error', (error) => {
      console.error("❌ MongoDB connection error:", error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn("⚠️  MongoDB disconnected");
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log("🔄 MongoDB reconnected");
    });
    
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

/**
 * Middleware Configuration
 * 
 * Sets up essential middleware for the Express application.
 * Includes CORS, JSON parsing, and security headers.
 */
const setupMiddleware = () => {
  // Enable CORS for cross-origin requests
  app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  // Parse JSON request bodies
  app.use(express.json({ limit: '10mb' }));
  
  // Parse URL-encoded request bodies
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Security headers
  app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
  });
};

/**
 * Route Registration
 * 
 * Registers API routes with their respective prefixes.
 * Organizes routes by functionality (auth, user, admin).
 */
const setupRoutes = () => {
  // Authentication routes
  app.use("/auth", authRouter);
  
  // User management routes
  app.use("/user", userRouter);
  
  // Admin management routes
  app.use("/admin", adminRouter);
  
  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  });
  
  // Root endpoint
  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to the JWT Login App Server!",
      version: "1.0.0",
      endpoints: {
        auth: "/auth",
        user: "/user", 
        admin: "/admin",
        health: "/health"
      }
    });
  });
  
  // 404 handler for undefined routes
  app.use("*", (req, res) => {
    res.status(404).json({
      error: "Route not found",
      path: req.originalUrl,
      method: req.method
    });
  });
};

/**
 * Error Handling Middleware
 * 
 * Global error handler for unhandled exceptions and errors.
 * Provides consistent error responses across the application.
 */
const setupErrorHandling = () => {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });
  
  // Global error handler middleware
  app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    
    res.status(error.status || 500).json({
      error: error.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  });
};

/**
 * Server Initialization
 * 
 * Main function that orchestrates the server setup process.
 * Validates environment, connects to database, and starts the server.
 */
const initializeServer = async () => {
  try {
    // Validate environment configuration
    validateEnvironment();
    
    // Setup database connection
    await setupDatabase();
    
    // Configure middleware
    setupMiddleware();
    
    // Register routes
    setupRoutes();
    
    // Setup error handling
    setupErrorHandling();
    
    // Start the server
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${port}/health`);
    });
    
  } catch (error) {
    console.error("❌ Server initialization failed:", error);
    process.exit(1);
  }
};

// Start the server
initializeServer();
