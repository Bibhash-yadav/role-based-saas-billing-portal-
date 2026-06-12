import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "VIEWER",
  });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post(
        "/auth/register",
        form
      );

      alert(
        "Registration Successful"
      );

      navigate("/");
    } catch (err: any) {
      alert(
        err?.response?.data
          ?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              S
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              Create Account
            </h1>

            <p className="text-gray-500 mt-2">
              SaaS Billing Portal
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Create password"
                value={
                  form.password
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    password:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="OWNER">
                  Owner
                </option>

                <option value="BILLING_ADMIN">
                  Billing Admin
                </option>

                <option value="VIEWER">
                  Viewer
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-semibold transition duration-200"
            >
              {loading
                ? "Creating Account..."
                : "Register"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?
            </p>

            <Link
              to="/"
              className="text-blue-600 font-semibold hover:text-blue-800"
            >
              Login Here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}