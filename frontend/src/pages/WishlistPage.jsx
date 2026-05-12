import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/shared/ProductCard';
import EmptyState from '../components/shared/EmptyState';

export default function WishlistPage() {
  const wishlistIds = useSelector((state) => state.wishlist.items);
  const products = useSelector((state) => state.products.products);
  const wishlistProducts = products.filter((product) => wishlistIds.includes(product._id || product.id));

  if (!wishlistProducts.length) {
    return (
      <section className="container-shell section-gap">
        <EmptyState
          title="Your wishlist is waiting"
          description="Save standout items here so you can compare later or move them into your cart."
          action={
            <Link to="/products" className="rounded-full bg-brand-secondary px-5 py-3 text-sm font-semibold text-white">
              Explore products
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section className="container-shell section-gap">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Wishlist</h1>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
