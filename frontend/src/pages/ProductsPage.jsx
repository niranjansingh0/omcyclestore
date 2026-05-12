import { useEffect, useState } from 'react';
import { Grid2x2, List, SlidersHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/shared/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
import SectionHeader from '../components/shared/SectionHeader';
import { fetchProducts, setFilters, setPage } from '../features/products/productSlice';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, filters, pagination, loading } = useSelector((state) => state.products);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q && q !== filters.search) {
      dispatch(setFilters({ search: q }));
    }
  }, [dispatch, searchParams, filters.search]);

  useEffect(() => {
    dispatch(fetchProducts({
      search: filters.search,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
      page: pagination.page,
      limit: 12
    }));
  }, [dispatch, filters, pagination.page]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(setPage(1));
  };

  return (
    <section className="container-shell section-gap">
      <SectionHeader eyebrow="Storefront" title="Shop every category with fast filters" subtitle="Search, sort, switch views, and narrow the catalog without losing browsing speed." />

      <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/70 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center rounded-full border border-slate-200 px-4 py-3 dark:border-slate-700">
          <input
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            placeholder="Search by product, brand, or category"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-medium lg:hidden dark:border-slate-700"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange({ sort: e.target.value })}
            className="rounded-full border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700"
          >
            <option value="popularity">Sort by popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top rated</option>
          </select>
          <div className="inline-flex rounded-full border border-slate-200 p-1 dark:border-slate-700">
            <button
              type="button"
              onClick={() => handleFilterChange({ view: 'grid' })}
              className={`rounded-full p-2 ${filters.view === 'grid' ? 'bg-brand-secondary text-white' : ''}`}
            >
              <Grid2x2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange({ view: 'list' })}
              className={`rounded-full p-2 ${filters.view === 'list' ? 'bg-brand-secondary text-white' : ''}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>
        <div>
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-panel h-72 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-brand-muted dark:text-brand-dark-muted">{pagination.total} products found</p>
              <div className={`grid gap-5 ${filters.view === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => dispatch(setPage(i + 1))}
                      className={`h-10 w-10 rounded-full text-sm font-medium transition ${
                        pagination.page === i + 1
                          ? 'bg-brand-primary text-white'
                          : 'border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="glass-panel py-16 text-center">
              <p className="text-lg font-semibold">No products found</p>
              <p className="mt-2 text-sm text-brand-muted">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}