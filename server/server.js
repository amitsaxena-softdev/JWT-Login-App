const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./Routers/userRouter");
const adminRouter = require("./Routers/adminRouter");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config({ path: "../.env" });

// MongoDB connection setup
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongoose connected to MongoDB!");
    app.use(cors());
    app.use(express.json());

    app.use("/user", userRouter);
    app.use("/admin", adminRouter);

    app.get("/", (req, res) => {
      res.send("Welcome to the JWT Login App Server!");
    });
    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running on http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.error(err);
  });
