import { useEffect, useState } from "react";
import API from "../api/axios";

interface Stats {
  totalUsers: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  activeSubscriptions: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [stats, setStats] =
    useState<Stats | null>(null);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    if (user.role !== "VIEWER") {
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get(
        "/dashboard/stats"
      );

      setStats(res.data.stats);
    } catch (err) {
      console.log(err);
    }
  };

const Card = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) => (
  <div
    className={`rounded-2xl p-6 shadow text-white ${color}`}
  >
    <h2 className="text-sm opacity-90">
      {title}
    </h2>

    <p className="text-4xl font-bold mt-3">
      {value}
    </p>
  </div>
);

  return (
   <div className="mb-8">
  <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl p-8 shadow mb-6">
    <h1 className="text-4xl font-bold">
      Welcome back, {user.name} 👋
    </h1>

    <p className="mt-3 text-slate-300">
      Logged in as {user.role}
    </p>
  </div>


     {user.role === "OWNER" && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

      <Card
        title="Revenue"
        value={`$${stats?.totalRevenue || 0}`}
        color="bg-green-600"
      />

      <Card
        title="Users"
        value={stats?.totalUsers || 0}
        color="bg-blue-600"
      />

      <Card
        title="Invoices"
        value={stats?.totalInvoices || 0}
        color="bg-purple-600"
      />

      <Card
        title="Paid"
        value={stats?.paidInvoices || 0}
        color="bg-emerald-600"
      />

      <Card
        title="Pending"
        value={stats?.pendingInvoices || 0}
        color="bg-orange-500"
      />

      <Card
        title="Subscriptions"
        value={
          stats?.activeSubscriptions ||
          0
        }
        color="bg-indigo-600"
      />

    </div>

    <div className="mt-8 bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Owner Overview
      </h2>

      <p className="text-gray-600">
        You have complete access to users,
        invoices, subscriptions and analytics.
      </p>
    </div>
  </>
)}

    {user.role ===
  "BILLING_ADMIN" && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <Card
        title="Revenue"
        value={`$${stats?.totalRevenue || 0}`}
        color="bg-green-600"
      />

      <Card
        title="Invoices"
        value={
          stats?.totalInvoices || 0
        }
        color="bg-blue-600"
      />

      <Card
        title="Pending"
        value={
          stats?.pendingInvoices ||
          0
        }
        color="bg-orange-500"
      />

      <Card
        title="Subscriptions"
        value={
          stats?.activeSubscriptions ||
          0
        }
        color="bg-purple-600"
      />

    </div>

    <div className="mt-8 bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Billing Admin Overview
      </h2>

      <p className="text-gray-600">
        Manage invoices, subscriptions and
        customer billing activities.
      </p>
    </div>
  </>
)}

     {user.role === "VIEWER" && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="bg-white rounded-2xl p-6 shadow">
        <h3 className="font-bold text-xl">
          📄 Invoices
        </h3>

        <p className="text-gray-500 mt-2">
          View all invoices and payment
          statuses.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow">
        <h3 className="font-bold text-xl">
          💳 Subscriptions
        </h3>

        <p className="text-gray-500 mt-2">
          Track active subscriptions and
          renewal dates.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow">
        <h3 className="font-bold text-xl">
          👤 Profile
        </h3>

        <p className="text-gray-500 mt-2">
          View account information and
          access permissions.
        </p>
      </div>

    </div>

    <div className="mt-8 bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold mb-5">
        Account Information
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="border rounded-xl p-4">
          <p className="text-gray-500">
            Name
          </p>

          <p className="font-semibold">
            {user.name}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-gray-500">
            Email
          </p>

          <p className="font-semibold">
            {user.email}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-gray-500">
            Role
          </p>

          <p className="font-semibold text-green-600">
            VIEWER
          </p>
        </div>

      </div>
    </div>

    <div className="mt-8 bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">
        Access Level
      </h2>

      <div className="space-y-3">

        <div className="flex justify-between">
          <span>View Invoices</span>
          <span className="text-green-600">
            Allowed
          </span>
        </div>

        <div className="flex justify-between">
          <span>View Subscriptions</span>
          <span className="text-green-600">
            Allowed
          </span>
        </div>

        <div className="flex justify-between">
          <span>Manage Users</span>
          <span className="text-red-600">
            Restricted
          </span>
        </div>

        <div className="flex justify-between">
          <span>Analytics</span>
          <span className="text-red-600">
            Restricted
          </span>
        </div>

      </div>
    </div>
  </>
)}
    </div>
  );
}