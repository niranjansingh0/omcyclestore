import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [salesByDay, setSalesByDay] = useState([]);
  const [loading, setLoading] = useState(true);
  const analyticsData = salesByDay.length > 0 ? salesByDay : [{ _id: 'No data', revenue: 0 }];
  const maxRevenue = Math.max(...salesByDay.map((item) => item.revenue), 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, ordersRes, inventoryRes, salesRes] = await Promise.all([
          adminAPI.getDashboard(),
          adminAPI.getOrders(),
          adminAPI.getInventory(),
          adminAPI.getSalesReport()
        ]);
        setStats(dashboardRes.data.stats || null);
        setRecentOrders(dashboardRes.data.recentOrders || []);
        setOrders(ordersRes.data.orders || []);
        setInventory(inventoryRes.data.products || []);
        setSalesByDay((salesRes.data.salesByDay || []).slice().reverse());
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 sm:h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dashboard overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-4 sm:p-5 dark:bg-slate-800">
          <p className="text-xs sm:text-sm text-brand-muted dark:text-brand-dark-muted">Total Revenue</p>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold">Rs. {stats?.totalRevenue?.toLocaleString() || '0'}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 sm:p-5 dark:bg-slate-800">
          <p className="text-xs sm:text-sm text-brand-muted dark:text-brand-dark-muted">Total Orders</p>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold">{stats?.totalOrders || '0'}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 sm:p-5 dark:bg-slate-800">
          <p className="text-xs sm:text-sm text-brand-muted dark:text-brand-dark-muted">Total Customers</p>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold">{stats?.totalUsers || '0'}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 sm:p-5 dark:bg-slate-800">
          <p className="text-xs sm:text-sm text-brand-muted dark:text-brand-dark-muted">Total Products</p>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold">{stats?.totalProducts || '0'}</p>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-[1fr,320px]">
        <div className="rounded-2xl border border-slate-200 p-4 sm:p-5 dark:border-slate-700">
          <h2 className="text-lg sm:text-xl font-bold">Inventory snapshot</h2>
          <div className="mt-4 sm:mt-5 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full min-w-[520px] text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-brand-muted dark:text-brand-dark-muted">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                </tr>
              </thead>
              <tbody>
                {inventory.slice(0, 8).map((product) => (
                  <tr key={product._id} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="py-3 font-medium">{product.name}</td>
                    <td className="py-3">{product.sku}</td>
                    <td className="py-3">Rs. {product.price?.toLocaleString?.() || product.price}</td>
                    <td className="py-3">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 p-4 sm:p-5 dark:border-slate-700">
            <h2 className="text-lg sm:text-xl font-bold">Recent orders</h2>
            <div className="mt-4 sm:mt-5 space-y-3">
              {(recentOrders.length > 0 ? recentOrders : orders.slice(0, 5)).map((order) => (
                <div key={order._id || order.id} className="rounded-xl bg-slate-50 p-3 sm:p-4 dark:bg-slate-800">
                  <p className="font-semibold text-sm sm:text-base">#{String(order._id || order.id).slice(-8)}</p>
                  <p className="mt-1 text-xs sm:text-sm text-brand-muted dark:text-brand-dark-muted">
                    {order.orderStatus || order.status || 'Pending'}
                  </p>
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base font-medium">Rs. {order.totalAmount?.toLocaleString?.() || order.total?.toLocaleString?.() || '0'}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 sm:p-5 dark:border-slate-700">
            <h2 className="text-lg sm:text-xl font-bold">Analytics</h2>
            <div className="mt-4 sm:mt-5 flex h-48 sm:h-56 items-end gap-2 sm:gap-3">
              {analyticsData.map((entry) => {
                const barHeight = Math.max((entry.revenue / maxRevenue) * 100, salesByDay.length > 0 ? 12 : 4);

                return (
                  <div key={entry._id} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-2xl bg-gradient-to-t from-brand-primary to-brand-accent"
                      style={{ height: `${barHeight}%` }}
                    />
                    <p className="text-xs text-brand-muted dark:text-brand-dark-muted">
                      {entry._id === 'No data' ? 'N/A' : new Date(entry._id).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
