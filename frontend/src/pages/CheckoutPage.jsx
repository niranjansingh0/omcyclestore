import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderAPI, paymentAPI } from '../services/api';
import { clearCartAsync } from '../features/cart/cartSlice';
import { isAuthenticated } from '../utils/auth';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.addresses?.[0] || '',
    city: '',
    paymentMethod: 'razorpay'
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!items.length) {
    navigate('/cart');
    return null;
  }

  const handleRazorpayPayment = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Create Razorpay order
      const { data } = await paymentAPI.createOrder({ amount: totalPrice, currency: 'INR' });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_razorpay_key_id',
        amount: data.amount,
        currency: data.currency,
        name: 'OmcycleStore',
        description: 'Order Payment',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            // Create order after successful payment
            const orderItems = items.map(item => ({
              productId: item.productId || item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }));

            await orderAPI.createOrder({
              items: orderItems,
              shippingAddress: `${formData.address}, ${formData.city}`,
              total: totalPrice,
              paymentId: response.razorpay_payment_id,
              paymentStatus: 'paid'
            });

            dispatch(clearCartAsync());
            navigate('/orders');
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#2563eb'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        productId: item.productId || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      await orderAPI.createOrder({
        items: orderItems,
        shippingAddress: `${formData.address}, ${formData.city}`,
        total: totalPrice,
        paymentMethod: 'cod',
        paymentStatus: 'pending'
      });

      dispatch(clearCartAsync());
      navigate('/orders');
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      handleCODOrder();
    }
  };

  return (
    <section className="container-shell section-gap grid gap-6 lg:grid-cols-[1fr,360px]">
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-2 block font-medium">Full name</span>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-2 block font-medium">Email address</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-2 block font-medium">Phone number</span>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-2 block font-medium">City</span>
            <input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
              required
            />
          </label>
          <label className="sm:col-span-2 text-sm">
            <span className="mb-2 block font-medium">Street address</span>
            <input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 dark:border-slate-700"
              required
            />
          </label>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold">Payment method</h2>
          <div className="mt-4 grid gap-3">
            {[
              { id: 'razorpay', label: 'Pay with Razorpay (Card, UPI, Wallet)' },
              { id: 'cod', label: 'Cash on Delivery' }
            ].map((method) => (
              <label key={method.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-700">
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={formData.paymentMethod === method.id}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                />
                <span className="text-sm font-medium">{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? 'Processing...' : 'Place order'}
        </button>
      </form>

      <aside className="glass-panel h-fit p-6">
        <h2 className="text-2xl font-bold">Order summary</h2>
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div key={item.productId || item.id} className="flex justify-between gap-3 text-sm">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>Rs. {(item.quantity * item.price).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>Rs. {totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </aside>
    </section>
  );
}