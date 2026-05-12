import { useDispatch, useSelector } from 'react-redux';
import { clearFilters } from '../../features/products/productSlice';

export default function FilterSidebar({ onFilterChange }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.products.categories);
  const filters = useSelector((state) => state.products.filters);
  const categoryList = Array.isArray(categories) ? categories : [];

  const handleCategoryChange = (category) => {
    if (onFilterChange) {
      onFilterChange({ category });
    } else {
      dispatch({ type: 'products/setFilters', payload: { category } });
    }
  };

  const handlePriceChange = (maxPrice) => {
    if (onFilterChange) {
      onFilterChange({ maxPrice });
    } else {
      dispatch({ type: 'products/setFilters', payload: { maxPrice } });
    }
  };

  return (
    <aside className="glass-panel h-fit p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold">Filters</h3>
        <button type="button" onClick={() => dispatch(clearFilters())} className="text-sm font-semibold text-brand-primary">
          Clear
        </button>
      </div>
      <div className="space-y-6">
        <div>
          <h4 className="mb-3 text-sm font-semibold">Category</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                checked={filters.category === 'all'}
                onChange={() => handleCategoryChange('all')}
              />
              All products
            </label>
            {categoryList.map((category) => (
              <label key={category._id || category.id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === (category._id || category.id)}
                  onChange={() => handleCategoryChange(category._id || category.id)}
                />
                {category.name} ({category.productCount || 0})
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Max Price</h4>
          <input
            type="range"
            min="500"
            max="25000"
            step="500"
            value={filters.maxPrice || 25000}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full"
          />
          <p className="mt-2 text-sm text-brand-muted dark:text-brand-dark-muted">Up to Rs. {(filters.maxPrice || 25000).toLocaleString()}</p>
        </div>
      </div>
    </aside>
  );
}
