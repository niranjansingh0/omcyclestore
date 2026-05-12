import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HeroSlider from '../components/home/HeroSlider';
import CategoryCard from '../components/shared/CategoryCard';
import ProductCard from '../components/shared/ProductCard';
import SectionHeader from '../components/shared/SectionHeader';

export default function HomePage() {
  const { products, categories, loading } = useSelector((state) => state.products);
  const productList = Array.isArray(products) ? products : [];
  const categoryList = Array.isArray(categories) ? categories : [];
  const featuredProducts = productList
    .filter((product) => product.featured)
    .slice(0, 8);
  const featuredDisplay = (featuredProducts.length > 0 ? featuredProducts : productList).slice(0, 8);
  const trendingProducts = [...productList]
    .sort((a, b) => (b.soldCount || b.reviewCount || 0) - (a.soldCount || a.reviewCount || 0))
    .slice(0, 8);
  const dealProduct = featuredDisplay[0] || productList[0] || null;

  return (
    <>
      <HeroSlider />

      <section className="container-shell section-gap">
        <SectionHeader
          eyebrow="Categories"
          title="Browse the store your way"
          subtitle="Six polished collections built around real shopping patterns, from upgrades to everyday restocks."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categoryList.slice(0, 6).map((category) => (
            <CategoryCard key={category._id || category.id} category={category} />
          ))}
          {!loading && categoryList.length === 0 && (
            <div className="glass-panel p-6 text-sm text-brand-muted dark:text-brand-dark-muted">
              No categories available yet.
            </div>
          )}
        </div>
      </section>

      <section className="container-shell section-gap">
        <SectionHeader
          eyebrow="Featured"
          title="Top-rated picks customers keep coming back for"
          subtitle="A premium mix of fast movers, high satisfaction scores, and strong value across the catalog."
          action={
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">
              View all
              <ArrowRight size={16} />
            </Link>
          }
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredDisplay.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
          {!loading && featuredDisplay.length === 0 && (
            <div className="glass-panel p-6 text-sm text-brand-muted dark:text-brand-dark-muted">
              No featured products available yet.
            </div>
          )}
        </div>
      </section>

      <section className="container-shell section-gap">
        <div className="glass-panel overflow-hidden p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-primary">Deal of the day</p>
              {dealProduct ? (
                <>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Save big on the {dealProduct.name}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted dark:text-brand-dark-muted">
                    {dealProduct.description}
                  </p>
                  <div className="mt-6 flex items-end gap-4">
                    <span className="text-4xl font-extrabold text-brand-primary">Rs. {dealProduct.price?.toLocaleString()}</span>
                    {dealProduct.compareAtPrice && (
                      <span className="pb-1 text-lg text-brand-muted line-through dark:text-brand-dark-muted">
                        Rs. {dealProduct.compareAtPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/product/${dealProduct._id || dealProduct.id}`}
                    className="mt-8 inline-flex rounded-full bg-brand-secondary px-6 py-3 text-sm font-semibold text-white"
                  >
                    Grab the deal
                  </Link>
                </>
              ) : (
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Check out our products</h2>
              )}
            </div>
            {dealProduct && (
              <img
                src={dealProduct.images?.[0]?.url || dealProduct.images?.[0] || '/placeholder.jpg'}
                alt={dealProduct.name}
                className="mx-auto h-80 w-full max-w-sm rounded-[2rem] object-cover"
              />
            )}
          </div>
        </div>
      </section>

      <section className="container-shell section-gap">
        <SectionHeader eyebrow="Trending" title="What shoppers are adding this week" subtitle="A fresh line-up of fast-moving products from across the most active categories." />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
          {!loading && trendingProducts.length === 0 && (
            <div className="glass-panel p-6 text-sm text-brand-muted dark:text-brand-dark-muted">
              No trending products available yet.
            </div>
          )}
        </div>
      </section>

      <section className="container-shell pb-16">
        <div className="glass-panel grid gap-6 p-8 sm:p-10 lg:grid-cols-[1fr,auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-primary">Newsletter</p>
            <h2 className="mt-3 text-3xl font-extrabold">Stay ahead of drops, deals, and restocks</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-muted dark:text-brand-dark-muted">
              Sign up for curated product highlights, limited-time pricing, and shopping tips tailored to what is trending.
            </p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded-full border border-slate-200 bg-transparent px-5 py-3 text-sm outline-none dark:border-slate-700"
            />
            <button type="button" className="rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
