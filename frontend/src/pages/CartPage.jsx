import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import QuantityInput from '../components/shared/QuantityInput';
import EmptyState from '../components/shared/EmptyState';
import { fetchCart, removeFromCartAsync, updateCartItemAsync } from '../features/cart/cartSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, totalPrice, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="container-shell section-gap">
        <div className="glass-panel p-8 text-center">
          <p className="text-brand-muted">Loading cart...</p>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="container-shell section-gap">
        <EmptyState
          title="Your cart is empty"
          description="Start adding products to build your order summary and move through checkout."
          action={
            <Link to="/products" className="rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white">
              Browse products
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section className="container-shell section-gap grid gap-6 lg:grid-cols-[1fr,360px]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id || item.productId} className="glass-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <img src={item.image} alt={item.name} className="h-28 w-28 rounded-[1.5rem] object-cover" />
            <div className="flex-1">
              <h2 className="text-lg font-bold">{item.name}</h2>
              <p className="mt-2 text-sm text-brand-muted dark:text-brand-dark-muted">Rs. {item.price.toLocaleString()} each</p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <QuantityInput
                value={item.quantity}
                onChange={(next) => dispatch(updateCartItemAsync({ itemId: item.id, quantity: Math.max(1, next) }))}
              />
              <button type="button" onClick={() => dispatch(removeFromCartAsync(item.id))} className="text-sm font-semibold text-red-500">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <aside className="glass-panel h-fit p-6">
        <h2 className="text-2xl font-bold">Summary</h2>
        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="border-t border-slate-200 pt-3 text-base font-bold dark:border-slate-700">
            <div className="flex justify-between">
              <span>Total</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <Link to="/checkout" className="mt-4 block rounded-full bg-brand-primary px-5 py-3 text-center text-sm font-semibold text-white">
          Proceed to checkout
        </Link>
      </aside>
    </section>
  );
}
