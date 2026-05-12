export default class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search(fields = []) {
    if (this.queryString.search && fields.length) {
      const expression = {
        $or: fields.map((field) => ({
          [field]: { $regex: this.queryString.search, $options: 'i' }
        }))
      };
      this.query = this.query.find(expression);
    }
    return this;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excluded = ['page', 'limit', 'sort', 'search', 'fields'];
    excluded.forEach((field) => delete queryObject[field]);

    if (queryObject.minPrice || queryObject.maxPrice) {
      queryObject.price = {};
      if (queryObject.minPrice) queryObject.price.$gte = Number(queryObject.minPrice);
      if (queryObject.maxPrice) queryObject.price.$lte = Number(queryObject.maxPrice);
      delete queryObject.minPrice;
      delete queryObject.maxPrice;
    }

    // Handle category=all or empty category - don't filter by category
    if (queryObject.category === 'all' || !queryObject.category) {
      delete queryObject.category;
    }

    this.query = this.query.find(queryObject);
    return this;
  }

  sort(defaultSort = '-createdAt') {
    const sortBy = this.queryString.sort?.split(',').join(' ') || defaultSort;
    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Math.min(Number(this.queryString.limit) || 10, 100);
    const skip = (page - 1) * limit;

    this.pagination = { page, limit, skip };
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
