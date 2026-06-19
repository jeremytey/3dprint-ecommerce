import { useEffect, useState } from "react";
import { adminApi, type AdminOrder } from "@/api/admin";

function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("admin_token") ?? "");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = (t: string) => {
    adminApi
      .getAllOrders(t)
      .then((data) => {
        setOrders(data);
        setError(null);
        sessionStorage.setItem("admin_token", t);
      })
      .catch(() => setError("Invalid token or fetch failed."));
  };

  useEffect(() => {
    if (token) fetchOrders(token);
  }, []);

  const handleStatusChange = (id: string, status: AdminOrder["status"]) => {
    adminApi.updateStatus(token, id, status).then(() => fetchOrders(token));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Admin token"
          className="border p-2"
        />
        <button onClick={() => fetchOrders(token)} className="border px-4 py-2">
          Load orders
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-2">
        {orders.map((order) => (
          <div key={order.id} className="border p-3">
            <p className="font-medium">{order.customerName} — {order.customerPhone}</p>
            <p className="text-sm">RM {order.totalAmount.toFixed(2)}</p>
            <select
              value={order.status}
              onChange={(e) =>
                handleStatusChange(order.id, e.target.value as AdminOrder["status"])
              }
              className="border p-1 mt-1"
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PRINTING">PRINTING</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;