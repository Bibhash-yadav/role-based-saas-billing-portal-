import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import invoiceRoutes from "./routes/invoice.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import dashboardRoutes from "./routes/dashboard.routes";
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    message:
      "SaaS Billing Portal API Running",
  });
});

app.use(
  "/api/auth",
  authRoutes
);
app.use(
  "/api/users",
  userRoutes
);
app.use(
  "/api/invoices",
  invoiceRoutes
);
app.use(
  "/api/subscriptions",
  subscriptionRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);


export default app;