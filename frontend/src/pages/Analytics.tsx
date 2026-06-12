import { useEffect, useState } from "react";
import API from "../api/axios";

interface AnalyticsData {
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  activeSubscriptions: number;
  totalUsers: number;
}

export default function Analytics() {
  const [data, setData] =
    useState<AnalyticsData>({
      totalRevenue: 0,
      totalInvoices: 0,
      paidInvoices: 0,
      pendingInvoices: 0,
      activeSubscriptions: 0,
      totalUsers: 0,
    });

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [
        invoiceRes,
        subscriptionRes,
        usersRes,
      ] = await Promise.all([
        API.get("/invoices"),
        API.get("/subscriptions"),
        API.get("/users"),
      ]);

      const invoices =
        invoiceRes.data.invoices || [];

      const subscriptions =
        subscriptionRes.data
          .subscriptions || [];

      const users =
        usersRes.data.users || [];

      const totalRevenue =
        invoices
          .filter(
            (i: any) =>
              i.status === "PAID"
          )
          .reduce(
            (
              sum: number,
              i: any
            ) =>
              sum + i.amount,
            0
          );

      setData({
        totalRevenue,
        totalInvoices:
          invoices.length,
        paidInvoices:
          invoices.filter(
            (i: any) =>
              i.status === "PAID"
          ).length,
        pendingInvoices:
          invoices.filter(
            (i: any) =>
              i.status ===
              "PENDING"
          ).length,
        activeSubscriptions:
          subscriptions.filter(
            (s: any) =>
              s.status ===
              "ACTIVE"
          ).length,
        totalUsers:
          users.length,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Analytics
        </h1>

        <p className="text-gray-500">
          SaaS Billing Overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Total Revenue
          </h3>

          <p className="text-3xl font-bold mt-2">
            $
            {data.totalRevenue.toFixed(
              2
            )}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Total Invoices
          </h3>

          <p className="text-3xl font-bold mt-2">
            {data.totalInvoices}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Paid Invoices
          </h3>

          <p className="text-3xl font-bold mt-2 text-green-600">
            {data.paidInvoices}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Pending Invoices
          </h3>

          <p className="text-3xl font-bold mt-2 text-yellow-600">
            {data.pendingInvoices}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Active Subscriptions
          </h3>

          <p className="text-3xl font-bold mt-2 text-blue-600">
            {
              data.activeSubscriptions
            }
          </p>
        </div>

        {user.role ===
          "OWNER" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">
              Total Users
            </h3>

            <p className="text-3xl font-bold mt-2">
              {data.totalUsers}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">
          Business Summary
        </h2>

        <div className="space-y-3">
          <p>
            Revenue Generated:
            <strong>
              {" "}
              $
              {data.totalRevenue.toFixed(
                2
              )}
            </strong>
          </p>

          <p>
            Total Customers:
            <strong>
              {" "}
              {
                data.activeSubscriptions
              }
            </strong>
          </p>

          <p>
            Invoice Collection Rate:
            <strong>
              {" "}
              {data.totalInvoices
                ? Math.round(
                    (data.paidInvoices /
                      data.totalInvoices) *
                      100
                  )
                : 0}
              %
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}