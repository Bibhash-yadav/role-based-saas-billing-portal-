import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Invoices from "../pages/Invoices";
import Subscriptions from "../pages/Subscriptions";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";

import DashboardLayout from "../layouts/DashboardLayout";
import RoleGuard from "../components/RoleGuard";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Area */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* OWNER + BILLING ADMIN */}

          <Route
            path="/users"
            element={
              <RoleGuard
                allowedRoles={[
                  "OWNER",
                  "BILLING_ADMIN",
                ]}
              >
                <Users />
              </RoleGuard>
            }
          />

          {/* ALL ROLES */}

          <Route
            path="/invoices"
            element={
              <RoleGuard
                allowedRoles={[
                  "OWNER",
                  "BILLING_ADMIN",
                  "VIEWER",
                ]}
              >
                <Invoices />
              </RoleGuard>
            }
          />

          <Route
            path="/subscriptions"
            element={
              <RoleGuard
                allowedRoles={[
                  "OWNER",
                  "BILLING_ADMIN",
                  "VIEWER",
                ]}
              >
                <Subscriptions />
              </RoleGuard>
            }
          />

          {/* OWNER + BILLING ADMIN */}

          <Route
            path="/analytics"
            element={
              <RoleGuard
                allowedRoles={[
                  "OWNER",
                  "BILLING_ADMIN",
                ]}
              >
                <Analytics />
              </RoleGuard>
            }
          />
        </Route>

        {/* Redirect Unknown Routes */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}