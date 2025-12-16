import express from "express";
import cors from "cors";
import path from "path";
import { connectDb } from "./lib/db.js";
import authRoutes from "./routers/auth.route.js";
import cityRoutes from "./routers/city.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import propertyRoutes from "./routers/property.route.js";
import enquiryRoutes from "./routers/enquiry.route.js";
import sellinginfoRoutes from "./routers/sellinginfo.route.js";
import visitScheduleRoute from "./routers/visitschedule.route.js";
import sendEmailRoute from "./routers/sendemail.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const allowedOrigins = [
  "https://www.bhoomikarealestate.com",
  "https://bhoomikarealestate.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files - only need this once
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/sellinginfo", sellinginfoRoutes);
app.use("/api/visitschedule", visitScheduleRoute);
app.use("/api/sendEmail", sendEmailRoute);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Serve index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
} else {
  // Development mode - show API info at root
  app.get("/", (req, res) => {
    res.json({
      message: "Bhoomika Real Estate API Server",
      status: "running",
      environment: "development"
    });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDb();
  console.log(`Server running on port ${PORT}`);
});