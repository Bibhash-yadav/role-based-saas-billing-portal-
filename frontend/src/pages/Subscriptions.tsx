import { useEffect, useState } from "react";
import API from "../api/axios";

interface Subscription {
  id: string;
  customerName: string;
  customerEmail: string;
  plan: string;
  price: number;
  status: string;
  endDate: string;
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [editModal, setEditModal] =
    useState(false);

  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

 const [form, setForm] = useState({
  customerName: "",
  customerEmail: "",
  plan: "",
  price: "",
  endDate: "",
});

  const [editForm, setEditForm] =
    useState({
      price: "",
      status: "ACTIVE",
    });

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await API.get(
        "/subscriptions"
      );

      setSubscriptions(
        res.data.subscriptions || []
      );
    } catch (err) {
      console.log(err);
    }
  };

  const createSubscription = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    await API.post(
      "/subscriptions",
      {
        customerName:
          form.customerName,
        customerEmail:
          form.customerEmail,
        plan: form.plan,
        price: Number(
          form.price
        ),
        endDate:
          form.endDate,
      }
    );

    setShowModal(false);

    setForm({
      customerName: "",
      customerEmail: "",
      plan: "",
      price: "",
      endDate: "",
    });

    fetchSubscriptions();
  } catch (err) {
    console.log(err);
    alert(
      "Failed to create subscription"
    );
  }
};

  const openEditModal = (
    subscription: Subscription
  ) => {
    setSelectedSubscription(
      subscription
    );

    setEditForm({
      price: String(
        subscription.price
      ),
      status:
        subscription.status,
    });

    setEditModal(true);
  };

  const updateSubscription = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedSubscription)
      return;

    try {
      await API.put(
        `/subscriptions/${selectedSubscription.id}`,
        {
          price: Number(
            editForm.price
          ),
          status:
            editForm.status,
        }
      );

      setEditModal(false);

      fetchSubscriptions();
    } catch (err) {
      console.log(err);

      alert(
        "Failed to update subscription"
      );
    }
  };

  const deleteSubscription =
    async (id: string) => {
      if (
        !window.confirm(
          "Delete subscription?"
        )
      )
        return;

      try {
        await API.delete(
          `/subscriptions/${id}`
        );

        fetchSubscriptions();
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Subscriptions
        </h1>

        {user.role !==
          "VIEWER" && (
          <button
            onClick={() =>
              setShowModal(true)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Subscription
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">
                  Customer
                </th>
  <th className="p-4 text-left">
                  Email
                </th>
                <th className="p-4 text-left">
                  Plan
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.length ===
                0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center p-8 text-gray-500"
                  >
                    No subscriptions found
                  </td>
                </tr>
              )}

              {subscriptions.map(
                (
                  subscription
                ) => (
                  <tr
                    key={
                      subscription.id
                    }
                    className="border-t"
                  >
                    <td className="p-4">
                      {
                        subscription.customerName
                      }
                    </td>
<td>
  {subscription.customerEmail}
</td>
                    <td className="p-4">
                      {
                        subscription.plan
                      }
                    </td>

                    <td className="p-4">
                      $
                      {
                        subscription.price
                      }
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          subscription.status ===
                          "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {
                          subscription.status
                        }
                      </span>
                    </td>

                    <td className="p-4 flex gap-2">
                      {user.role !==
                        "VIEWER" && (
                        <button
                          onClick={() =>
                            openEditModal(
                              subscription
                            )
                          }
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}

                      {user.role ===
                        "OWNER" && (
                        <button
                          onClick={() =>
                            deleteSubscription(
                              subscription.id
                            )
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Create Subscription
            </h2>

            <form
              onSubmit={
                createSubscription
              }
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Customer Name"
                value={
                  form.customerName
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    customerName:
                      e.target
                        .value,
                  })
                }
                className="w-full border p-3 rounded"
                required
              />
<input
  type="email"
  placeholder="Customer Email"
  value={
    form.customerEmail
  }
  onChange={(e) =>
    setForm({
      ...form,
      customerEmail:
        e.target.value,
    })
  }
  className="w-full border p-3 rounded"
  required
/>

<input
  type="text"
  placeholder="Plan"
  value={form.plan}
  onChange={(e) =>
    setForm({
      ...form,
      plan:
        e.target.value,
    })
  }
  className="w-full border p-3 rounded"
  required
/>

<input
  type="number"
  placeholder="Price"
  value={form.price}
  onChange={(e) =>
    setForm({
      ...form,
      price:
        e.target.value,
    })
  }
  className="w-full border p-3 rounded"
  required
/>

<input
  type="date"
  value={form.endDate}
  onChange={(e) =>
    setForm({
      ...form,
      endDate:
        e.target.value,
    })
  }
  className="w-full border p-3 rounded"
  required
/>
              <input
                type="text"
                placeholder="Plan Name"
                value={
                  form.plan
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    plan:
                      e.target
                        .value,
                  })
                }
                className="w-full border p-3 rounded"
                required
              />

              <input
                type="number"
                placeholder="Amount"
                value={
                  form.price
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    price:
                      e.target
                        .value,
                  })
                }
                className="w-full border p-3 rounded"
                required
              />

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
                    setShowModal(
                      false
                    )
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

      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Edit Subscription
            </h2>

            <form
              onSubmit={
                updateSubscription
              }
              className="space-y-4"
            >
              <input
                type="number"
                value={
                  editForm.price
                }
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    price:
                      e.target
                        .value,
                  })
                }
                className="w-full border p-3 rounded"
              />

              <select
                value={
                  editForm.status
                }
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    status:
                      e.target
                        .value,
                  })
                }
                className="w-full border p-3 rounded"
              >
                <option value="ACTIVE">
                  Active
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white p-3 rounded"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEditModal(
                      false
                    )
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