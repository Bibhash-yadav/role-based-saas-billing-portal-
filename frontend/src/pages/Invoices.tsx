
import { useEffect, useState } from "react";
import API from "../api/axios";

interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: string;
}

export default function Invoices() {
  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    amount: "",
    dueDate: "",
  });
const [editModal, setEditModal] =
  useState(false);

const [selectedInvoice, setSelectedInvoice] =
  useState<Invoice | null>(null);

const [editForm, setEditForm] =
  useState({
    amount: "",
    status: "PENDING",
  });
  const openEditModal = (
  invoice: Invoice
) => {
  setSelectedInvoice(invoice);

  setEditForm({
    amount: String(invoice.amount),
    status: invoice.status,
  });

  setEditModal(true);
};

const updateInvoice = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  if (!selectedInvoice)
    return;

  try {
    await API.put(
      `/invoices/${selectedInvoice.id}`,
      {
        amount: Number(
          editForm.amount
        ),
        status:
          editForm.status,
      }
    );

    setEditModal(false);

    fetchInvoices();
  } catch (err) {
    console.log(err);
    alert(
      "Failed to update invoice"
    );
  }
};
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await API.get(
        "/invoices"
      );

      setInvoices(
        res.data.invoices || []
      );
    } catch (err) {
      console.log(err);
    }
  };

  const createInvoice = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await API.post(
        "/invoices",
        {
          customerName:
            form.customerName,
          customerEmail:
            form.customerEmail,
          amount:
            Number(form.amount),
          dueDate:
            form.dueDate,
        }
      );

      setShowModal(false);

      setForm({
        customerName: "",
        customerEmail: "",
        amount: "",
        dueDate: "",
      });

      fetchInvoices();
    } catch (err) {
      console.log(err);
      alert(
        "Failed to create invoice"
      );
    }
  };

  const deleteInvoice = async (
    id: string
  ) => {
    if (
      !window.confirm(
        "Delete invoice?"
      )
    )
      return;

    try {
      await API.delete(
        `/invoices/${id}`
      );

      fetchInvoices();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Invoices
        </h1>

        {user.role !==
          "VIEWER" && (
          <button
            onClick={() =>
              setShowModal(true)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Invoice
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
              {invoices.map(
                (invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-t"
                  >
                    <td className="p-4">
                      {
                        invoice.customerName
                      }
                    </td>

                    <td className="p-4">
                      {
                        invoice.customerEmail
                      }
                    </td>

                    <td className="p-4">
                      $
                      {invoice.amount}
                    </td>

                    <td className="p-4">
  <span
    className={`px-3 py-1 rounded-full text-sm ${
      invoice.status ===
      "PAID"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {invoice.status}
  </span>
</td>

                    <td className="p-4 flex gap-2">
                      {user.role !== "VIEWER" && (
  <button
    onClick={() =>
      openEditModal(invoice)
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
                            deleteInvoice(
                              invoice.id
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
              Create Invoice
            </h2>

            <form
              onSubmit={
                createInvoice
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
                  form.amount
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount:
                      e.target
                        .value,
                  })
                }
                className="w-full border p-3 rounded"
                required
              />

              <input
                type="date"
                value={
                  form.dueDate
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    dueDate:
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
        Edit Invoice
      </h2>

      <form
        onSubmit={updateInvoice}
        className="space-y-4"
      >
        <input
          type="number"
          value={
            editForm.amount
          }
          onChange={(e) =>
            setEditForm({
              ...editForm,
              amount:
                e.target.value,
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
                e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        >
          <option value="PENDING">
            Pending
          </option>

          <option value="PAID">
            Paid
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
              setEditModal(false)
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
