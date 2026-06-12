import {
  LayoutDashboard,
  Users,
  Receipt,
  CreditCard,
  BarChart3,
  Menu,
  LogOut,
  X,
  Settings,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();

  const [open, setOpen] =
    useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const ownerMenu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/dashboard",
    },
    {
      name: "Users",
      icon: <Users size={18} />,
      path: "/users",
    },
    {
      name: "Invoices",
      icon: <Receipt size={18} />,
      path: "/invoices",
    },
    {
      name: "Subscriptions",
      icon: <CreditCard size={18} />,
      path: "/subscriptions",
    },
    {
      name: "Analytics",
      icon: <BarChart3 size={18} />,
      path: "/analytics",
    },
    {
  name: "Settings",
  icon: <Settings size={18} />,
  path: "/settings",
},
  ];

  const billingMenu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/dashboard",
    },
    {
      name: "Users",
      icon: <Users size={18} />,
      path: "/users",
    },
    {
      name: "Invoices",
      icon: <Receipt size={18} />,
      path: "/invoices",
    },
    {
      name: "Subscriptions",
      icon: <CreditCard size={18} />,
      path: "/subscriptions",
    },
    {
      name: "Analytics",
      icon: <BarChart3 size={18} />,
      path: "/analytics",
    },
    {
  name: "Settings",
  icon: <Settings size={18} />,
  path: "/settings",
},
  ];

  const viewerMenu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/dashboard",
    },
    {
      name: "Invoices",
      icon: <Receipt size={18} />,
      path: "/invoices",
    },
    {
      name: "Subscriptions",
      icon: <CreditCard size={18} />,
      path: "/subscriptions",
    },
    {
  name: "Settings",
  icon: <Settings size={18} />,
  path: "/settings",
},
  ];

  const menu =
    user.role === "OWNER"
      ? ownerMenu
      : user.role ===
        "BILLING_ADMIN"
      ? billingMenu
      : viewerMenu;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
      >
        <Menu />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
        fixed md:relative z-50
        h-screen w-64 bg-slate-900 text-white
        transition-all duration-300
        ${
          open
            ? "left-0"
            : "-left-64"
        }
        md:left-0
      `}
      >
        <div className="p-5 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-xl">
              SaaS Portal
            </h1>

            <p className="text-sm text-slate-400">
              {user.role}
            </p>
          </div>

          <button
            className="md:hidden"
            onClick={() =>
              setOpen(false)
            }
          >
            <X />
          </button>
        </div>

        <nav className="p-3">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded mb-2 ${
                location.pathname ===
                item.path
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
              onClick={() =>
                setOpen(false)
              }
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

          <button
            onClick={logout}
            className="w-full mt-5 bg-red-600 hover:bg-red-700 p-3 rounded flex items-center gap-3"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}