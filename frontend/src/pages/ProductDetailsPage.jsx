import { Heart, ShieldCheck, ShoppingCart, Star, Truck, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/shared/ProductCard';
import QuantityInput from '../components/shared/QuantityInput';
import RatingStars from '../components/shared/RatingStars';
import EmptyState from '../components/shared/EmptyState';
import { fetchProduct, clearCurrentProduct } from '../features/products/productSlice';
import { addToCartAsync } from '../features/cart/cartSlice';
import { toggleWishlistAsync } from '../features/wishlist/wishlistSlice';
import { reviewAPI } from '../services/api';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, relatedProducts, products, loading } = useSelector((state) => state.products);
  const wishlist = useSelector((state) => state.wishlist.items);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);
  const product = currentProduct;
  const productId = product?.id || product?._id;
  const isInWishlist = wishlist.includes(productId);
  const categoryName =
    typeof product?.category === 'string' ? product.category : product?.category?.name || 'Uncategorized';
  const isInStock = typeof product?.stock === 'number' ? product.stock > 0 : !!product?.inStock;

  // Helper to get image URL from image object
  const getImageUrl = (img) => (typeof img === 'string' ? img : img?.url);
  const fallbackRelatedProducts = useMemo(() => {
    if (!productId || !Array.isArray(products) || !product) return [];

    const currentCategoryId =
      typeof product.category === 'string' ? product.category : product.category?._id;

    return products
      .filter((item) => {
        const itemId = item.id || item._id;
        const itemCategoryId =
          typeof item.category === 'string' ? item.category : item.category?._id;

        return itemId !== productId && itemCategoryId === currentCategoryId;
      })
      .slice(0, 4);
  }, [product, productId, products]);
  const displayRelatedProducts = relatedProducts.length > 0 ? relatedProducts : fallbackRelatedProducts;

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, id]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const res = await reviewAPI.getProductReviews(productId);
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    setReviewSubmitting(true);
    setReviewMessage(null);
    try {
      await reviewAPI.createReview(productId, reviewForm);
      setReviewMessage({ type: 'success', text: 'Review saved successfully!' });
      setReviewForm({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      fetchReviews();
    } catch (error) {
      setReviewMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit review' });
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Delete this review?')) return;
    try {
      await reviewAPI.deleteReview(reviewId);
      fetchReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const userHasReviewed = reviews.some(r => r.user?._id === user?._id || r.user === user?._id);

  if (loading) {
    return (
      <section className="container-shell section-gap">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr,1fr]">
          <div className="glass-panel aspect-square h-auto animate-pulse rounded-2xl sm:h-[520px] sm:rounded-3xl" />
          <div className="glass-panel h-[300px] animate-pulse rounded-2xl sm:h-[520px] sm:rounded-3xl" />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container-shell section-gap">
        <EmptyState
          title="Product not found"
          description="The item you are looking for is unavailable or the link is incorrect."
          action={
            <Link to="/products" className="rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white">
              Back to products
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section className="container-shell section-gap">
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr,1fr]">
        <div className="space-y-3 sm:space-y-4">
          <div className="glass-panel overflow-hidden">
            <img src={getImageUrl(product.images[selectedImage])} alt={product.name} className="aspect-square h-auto w-full object-cover sm:aspect-auto sm:h-[520px]" />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-3 sm:gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-xl border-2 transition sm:rounded-[1.5rem] ${selectedImage === index ? 'border-brand-primary' : 'border-transparent'}`}
                >
                  <img src={getImageUrl(image)} alt={`${product.name} ${index + 1}`} className="aspect-square h-16 w-full object-cover sm:h-28" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel p-4 sm:p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary sm:text-sm">{product.brand}</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:mt-3 sm:text-3xl">{product.name}</h1>
          <div className="mt-3 sm:mt-4">
            <RatingStars rating={product.averageRating || 0} reviewCount={product.reviewCount || 0} />
          </div>
          <div className="mt-4 flex items-end gap-3 sm:mt-6">
            <span className="text-2xl font-extrabold text-brand-secondary sm:text-4xl">Rs. {product.price?.toLocaleString()}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="pb-0.5 text-sm text-brand-muted line-through dark:text-brand-dark-muted sm:text-lg">
                Rs. {product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>
          <p className="mt-4 text-sm leading-6 text-brand-muted dark:text-brand-dark-muted sm:mt-6 sm:text-base">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
            <QuantityInput value={quantity} onChange={(next) => setQuantity(Math.max(1, next))} />
            <button
              type="button"
              onClick={() => dispatch(addToCartAsync({ productId, quantity, price: product.price, name: product.name, image: getImageUrl(product.images[0]) }))}
              className="flex-1 rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-white sm:flex-none sm:px-6"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => dispatch(toggleWishlistAsync(productId))}
              className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold dark:border-slate-700 sm:px-6"
            >
              <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800 sm:rounded-[1.5rem] sm:p-4">
              <Truck size={16} className="text-brand-primary sm:size-18" />
              <p className="mt-2 text-xs font-semibold sm:mt-3 sm:text-sm">Fast delivery</p>
              <p className="mt-1 text-xs text-brand-muted dark:text-brand-dark-muted sm:text-sm">Ships within 24 hours.</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800 sm:rounded-[1.5rem] sm:p-4">
              <ShieldCheck size={16} className="text-brand-primary sm:size-18" />
              <p className="mt-2 text-xs font-semibold sm:mt-3 sm:text-sm">Secure checkout</p>
              <p className="mt-1 text-xs text-brand-muted dark:text-brand-dark-muted sm:text-sm">Protected payment.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-[1fr,280px] xl:grid-cols-[1fr,360px]">
        <div className="glass-panel p-4 sm:p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold sm:text-2xl">Reviews</h2>
            {isAuthenticated && !userHasReviewed && !showReviewForm && (
              <button
                type="button"
                onClick={() => setShowReviewForm(true)}
                className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white sm:text-sm sm:px-5 sm:py-2.5"
              >
                Write a Review
              </button>
            )}
          </div>

          {reviewMessage && (
            <div className={`mt-3 rounded-xl p-3 text-sm ${reviewMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {reviewMessage.text}
            </div>
          )}

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700 sm:p-5">
              <h3 className="font-semibold">Your Review</h3>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="text-xl transition"
                  >
                    <Star size={20} fill={reviewForm.rating >= star ? '#f59e0b' : 'none'} className={reviewForm.rating >= star ? 'text-amber-400' : 'text-slate-300'} />
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                placeholder="Review title (optional)"
                className="mt-3 w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm dark:border-slate-700"
              />
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your experience..."
                rows={3}
                className="mt-3 w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm dark:border-slate-700"
                required
              />
              <div className="mt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowReviewForm(false); setReviewMessage(null); }}
                  className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold dark:border-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
            {reviewLoading ? (
              <div className="py-4 text-center text-sm text-brand-muted">Loading reviews...</div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700 sm:rounded-[1.5rem] sm:p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{review.user?.name || 'Customer'}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={12} fill={review.rating >= star ? '#f59e0b' : 'none'} className={review.rating >= star ? 'text-amber-400' : 'text-slate-300'} />
                        ))}
                      </div>
                      {(user?._id === review.user?._id || user?.role === 'admin') && (
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  {review.title && <p className="mt-1 text-sm font-medium">{review.title}</p>}
                  <p className="mt-1 text-xs text-brand-muted dark:text-brand-dark-muted sm:mt-2 sm:text-sm">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-brand-muted">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
        <div className="glass-panel p-4 sm:p-6">
          <h2 className="text-xl font-bold sm:text-2xl">Product details</h2>
          <div className="mt-4 space-y-2 text-sm text-brand-muted dark:text-brand-dark-muted sm:mt-5 sm:space-y-3">
            <p>Category: {categoryName}</p>
            <p>Tags: {product.tags?.join(', ') || 'Fast shipping'}</p>
            <p>Status: {isInStock ? 'In stock' : 'Limited stock'}</p>
            <p>Returns: 7-day easy return</p>
          </div>
        </div>
      </div>

      {displayRelatedProducts.length > 0 && (
        <div className="mt-8 sm:mt-12">
          <h2 className="mb-4 text-2xl font-extrabold tracking-tight sm:mb-6 sm:text-3xl">Related products</h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {displayRelatedProducts.map((item) => (
              <ProductCard key={item.id || item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
