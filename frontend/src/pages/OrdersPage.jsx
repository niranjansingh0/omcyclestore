import { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatShippingAddress = (address) => {
    if (!address) return '';

    return [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ]
      .filter(Boolean)
      .join(', ');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getOrders();
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <section className="container-shell section-gap">
        <h1 className="text-3xl font-extrabold tracking-tight">Order history</h1>
        <div className="mt-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-panel h-32 animate-pulse rounded-3xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!orders.length) {
    return (
      <section className="container-shell section-gap">
        <h1 className="text-3xl font-extrabold tracking-tight">Order history</h1>
        <div className="mt-8 glass-panel py-16 text-center">
          <p className="text-lg font-semibold">No orders yet</p>
          <p className="mt-2 text-sm text-brand-muted">Start shopping to see your order history here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-shell section-gap">
      <h1 className="text-3xl font-extrabold tracking-tight">Order history</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order._id || order.id} className="glass-panel p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary">
                  {order.orderNumber || order._id || order.id}
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  {order.items?.map((item) => item.name || item.product?.name).join(', ') || 'Items'}
                </h2>
                <p className="mt-2 text-sm text-brand-muted dark:text-brand-dark-muted">
                  Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date}
                </p>
                {order.shippingAddress && (
                  <p className="mt-1 text-sm text-brand-muted dark:text-brand-dark-muted">
                    Shipping: {formatShippingAddress(order.shippingAddress)}
                  </p>
                )}
              </div>
              <div className="text-left sm:text-right">
                <p className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${
                  order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                  order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                }`}>
                  {order.orderStatus || order.status || 'placed'}
                </p>
                <p className="mt-3 text-lg font-bold">
                  Rs. {(order.totalAmount || order.total || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
