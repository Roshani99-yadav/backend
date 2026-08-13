import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { sendMail } from "./mailer.js";
import { buildEnquiryEmailHtml } from "./emailTemplate.js";
import { validateContact, validateGetQuote } from "./validators.js";
import { initDb } from "./db.js";
import blogRoutes from "./routes/blogRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (no Origin header, e.g. curl/health checks)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// Mount Blog & Keyword MySQL REST APIs
app.use("/api", blogRoutes);

// Basic abuse protection: 10 requests per 10 minutes per IP on the public form endpoints.
const formLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// Wraps an async route handler so rejected promises reach the error middleware
// instead of crashing the process or hanging the request.
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function getClientIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip;
}

function nowParts() {
  const now = new Date();
  return {
    date: now.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
    time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };
}

app.get(["/api/health", "/healthz", "/"], (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post(
  "/api/contact",
  formLimiter,
  asyncHandler(async (req, res) => {
    const errors = validateContact(req.body || {});
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const { name, phone, countryCode, countryName, email, subject, enquiryType, message } =
      req.body;
    const { date, time } = nowParts();
    const ip = getClientIp(req);

    const html = buildEnquiryEmailHtml({
      formType: "Contact Us",
      name: name.trim(),
      phone: phone.trim(),
      countryCode: countryCode.trim(),
      countryName: countryName.trim(),
      email: email ? email.trim() : "",
      subject: subject.trim(),
      enquiryType,
      message: message.trim(),
      date,
      time,
      ip,
    });

    await sendMail({
      to: process.env.MAIL_TO,
      subject: `New Contact Us Enquiry from ${name.trim()} — Aarvisac Control`,
      html,
      replyTo: email ? email.trim() : undefined,
    });

    res.status(200).json({
      success: true,
      message: "Your enquiry has been submitted successfully.",
    });
  })
);

app.post(
  "/api/get-quote",
  formLimiter,
  asyncHandler(async (req, res) => {
    const errors = validateGetQuote(req.body || {});
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const { name, company, phone, countryCode, countryName, email, enquiryType, message } =
      req.body;
    const { date, time } = nowParts();
    const ip = getClientIp(req);

    const html = buildEnquiryEmailHtml({
      formType: "Get a Quote",
      name: name.trim(),
      phone: phone.trim(),
      countryCode: countryCode.trim(),
      countryName: countryName.trim(),
      email: email ? email.trim() : "",
      company: company ? company.trim() : "",
      enquiryType,
      message: message.trim(),
      date,
      time,
      ip,
    });

    await sendMail({
      to: process.env.MAIL_TO,
      subject: `New Get a Quote Enquiry from ${name.trim()} — Aarvisac Control`,
      html,
      replyTo: email ? email.trim() : undefined,
    });

    res.status(200).json({
      success: true,
      message: "Your quote request has been submitted successfully.",
    });
  })
);

// 404 fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found." });
});

// Centralized error handler - never leak stack traces or SMTP internals to the client.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[server] Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
});

app.listen(PORT, async () => {
  console.log(`Aarvisac Control server listening at http://localhost:${PORT}`);
  await initDb();
});