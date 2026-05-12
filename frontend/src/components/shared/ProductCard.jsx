import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCartAsync } from '../../features/cart/cartSlice';
import { toggleWishlistAsync } from '../../features/wishlist/wishlistSlice';
import RatingStars from './RatingStars';

// Helper to get product ID (handles both _id from backend and id from frontend)
const getProductId = (product) => product.id || product._id;

// Helper to get image URL (handles both array of strings and array of objects)
const getImageUrl = (product) => {
  if (!product.images || product.images.length === 0) return '/placeholder.jpg';
  const img = product.images[0];
  return typeof img === 'string' ? img : img.url;
};

// Helper to get rating
const getRating = (product) => product.rating ?? product.averageRating ?? 0;

// Helper to get review count
const getReviewCount = (product) => product.reviewCount ?? 0;

// Helper to get original price
const getOriginalPrice = (product) => product.originalPrice ?? product.compareAtPrice ?? product.price;

// Helper to get badge
const getBadge = (product) => {
  if (product.badge) return product.badge;
  if (product.stock === 0) return 'Out of Stock';
  if (product.stock < 10) return 'Low Stock';
  return 'In Stock';
};

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const productId = getProductId(product);
  const isWishlisted = wishlist.includes(productId);
  const imageUrl = getImageUrl(product);

  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="group glass-panel overflow-hidden"
    >
      <div className="relative overflow-hidden">
        <Link to={`/product/${productId}`} className="block">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-48 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-64"
          />
        </Link>
        <span className="absolute left-3 top-3 rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-semibold text-white sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs">
          {getBadge(product)}
        </span>
        <button
          type="button"
          onClick={() => dispatch(toggleWishlistAsync(productId))}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm dark:bg-slate-900/90 sm:right-4 sm:top-4"
        >
          <Heart size={14} className={`sm:size-4 ${isWishlisted ? 'text-brand-primary' : ''}`} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="space-y-3 p-4 sm:space-y-4 sm:p-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-primary sm:text-xs">{product.brand}</p>
          <Link to={`/product/${productId}`} className="mt-1 block text-base font-bold leading-snug sm:mt-2 sm:text-lg">
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs text-brand-muted dark:text-brand-dark-muted sm:mt-2 sm:text-sm">{product.description}</p>
        </div>
        <RatingStars rating={getRating(product)} reviewCount={getReviewCount(product)} />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-extrabold sm:text-xl">Rs. {product.price.toLocaleString()}</div>
            {getOriginalPrice(product) > product.price && (
              <div className="text-xs text-brand-muted line-through dark:text-brand-dark-muted sm:text-sm">
                Rs. {getOriginalPrice(product).toLocaleString()}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              dispatch(
                addToCartAsync({
                  productId: productId,
                  quantity: 1,
                  price: product.price,
                  name: product.name,
                  image: imageUrl,
                })
              )
            }
            className="rounded-full bg-brand-secondary p-2.5 text-white transition hover:scale-105 sm:p-3"
          >
            <ShoppingCart size={16} className="sm:size-[18px]" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
