import { useEffect, useState } from "react";
import API from "../api/axios";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function Users() {
    const [users, setUsers] =
        useState<User[]>([]);

    const [filteredUsers, setFilteredUsers] =
        useState<User[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "VIEWER",
    });

    const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        setFilteredUsers(
            users.filter(
                (user) =>
                    user.name
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    user.email
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            )
        );
    }, [search, users]);

    const fetchUsers = async () => {
        try {
            const res = await API.get(
                "/users"
            );

            setUsers(
                res.data.users || []
            );

            setFilteredUsers(
                res.data.users || []
            );
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            await API.post(
                "/auth/register",
                form
            );

            setShowModal(false);

            setForm({
                name: "",
                email: "",
                password: "",
                role: "VIEWER",
            });

            fetchUsers();
        } catch (err) {
            console.log(err);
            alert(
                "Failed to create user"
            );
        }
    };

    const deleteUser = async (
        id: string
    ) => {
        if (
            !window.confirm(
                "Delete user?"
            )
        )
            return;

        try {
            await API.delete(
                `/users/${id}`
            );

            fetchUsers();
        } catch (err) {
            console.log(err);
        }
    };



    const badgeColor = (
        role: string
    ) => {
        switch (role) {
            case "OWNER":
                return "bg-purple-100 text-purple-700";

            case "BILLING_ADMIN":
                return "bg-blue-100 text-blue-700";

            default:
                return "bg-green-100 text-green-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Users Management
                        </h1>

                        <p className="text-gray-500">
                            Manage portal users
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="border rounded-lg px-4 py-2"
                        />

                        {currentUser.role ===
                            "OWNER" && (
                                <button
                                    onClick={() =>
                                        setShowModal(true)
                                    }
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Add User
                                </button>
                            )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        Loading...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-4 text-left border-b">
                                        Name
                                    </th>

                                    <th className="p-4 text-left border-b">
                                        Email
                                    </th>

                                    <th className="p-4 text-left border-b">
                                        Role
                                    </th>

                                    {currentUser.role ===
                                        "OWNER" && (
                                            <th className="p-4 text-left border-b">
                                                Actions
                                            </th>
                                        )}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map(
                                    (user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b hover:bg-slate-50"
                                        >

                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold">
                                                            {user.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                {user.email}
                                            </td>

                                            <td className="p-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${badgeColor(
                                                        user.role
                                                    )}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            {currentUser.role ===
                                                "OWNER" && (
                                                    <td className="p-4 flex gap-2">
                                                        
                                                        
                                                            <button
                                                                disabled={
                                                                    user.id === currentUser.id
                                                                }
                                                                onClick={() =>
                                                                    deleteUser(user.id)
                                                                }
                                                                className={`px-4 py-2 rounded-lg text-white ${user.id === currentUser.id
                                                                        ? "bg-gray-400 cursor-not-allowed"
                                                                        : "bg-red-600 hover:bg-red-700"
                                                                    }`}
                                                            >
                                                                Delete
                                                            </button>
                                                        
                                                    </td>
                                                )}
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">
                            Create User
                        </h2>

                        <form
                            onSubmit={createUser}
                            className="space-y-4"
                        >
                            <input
                                type="text"
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        name:
                                            e.target.value,
                                    })
                                }
                                className="w-full border p-3 rounded"
                                required
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email:
                                            e.target.value,
                                    })
                                }
                                className="w-full border p-3 rounded"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password:
                                            e.target.value,
                                    })
                                }
                                className="w-full border p-3 rounded"
                                required
                            />

                            <select
                                value={form.role}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        role:
                                            e.target.value,
                                    })
                                }
                                className="w-full border p-3 rounded"
                            >
                                <option value="OWNER">
                                    OWNER
                                </option>

                                <option value="BILLING_ADMIN">
                                    BILLING_ADMIN
                                </option>

                                <option value="VIEWER">
                                    VIEWER
                                </option>
                            </select>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white p-3 rounded"
                                >
                                    Create
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                    className="flex-1 bg-gray-300 p-3 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}