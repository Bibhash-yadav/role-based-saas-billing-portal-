import { useState } from "react";

export default function Settings() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Settings
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Profile Information
        </h2>

        <div className="space-y-3">
          <p>
            <strong>Name:</strong>{" "}
            {user.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user.email}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {user.role}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Change Password
        </h2>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(
                e.target.value
              )
            }
            className="w-full border p-3 rounded"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            className="w-full border p-3 rounded"
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Logout
        </h2>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}