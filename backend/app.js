const express = require("express");
const cors = require("cors");
const path = require('path')

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const userRoutes = require("./routes/user");
const booksRoutes = require("./routes/book");
const uploadRoutes = require("./routes/upload");

app.use("/api/auth", userRoutes);
app.use("/api", booksRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/upload", uploadRoutes);


module.exports = app;
