"use strict";
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

try {
  mongoose.connect(
    "mongodb+srv://prashant:prashant@cluster0.h7czokx.mongodb.net/?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );
  const db = mongoose.connection;
  db.once("open", function () {
    console.log("Database connected successfully!");
  });
} catch (error) {
  db.on("error", console.error.bind(console, "Database connection failed"));
}