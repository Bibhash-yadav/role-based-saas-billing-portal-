import React from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({
  children,
  allowedRoles,
}: RoleGuardProps) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  if (
    !user?.role ||
    !allowedRoles.includes(user.role)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-4xl font-bold text-red-600">
            403
          </h1>

          <p className="mt-2 text-gray-600">
            Access Denied
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}