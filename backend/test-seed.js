import connectDB from './config/db.js';
import { Category } from './models/index.js';
import { slugify } from './utils/helpers.js';

const categories = [
  { name: 'Electronics', type: 'product', description: 'Latest gadgets and tech accessories' },
  { name: 'Fashion', type: 'product', description: 'Trendy clothing and accessories' },
  { name: 'Home & Living', type: 'product', description: 'Furniture and home essentials' },
  { name: 'Sports & Fitness', type: 'product', description: 'Sports equipment and fitness gear' },
  { name: 'Books & Media', type: 'product', description: 'Books and entertainment media' },
  { name: 'Beauty & Health', type: 'product', description: 'Beauty products and health supplements' }
];

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const categoriesToInsert = categories.map((category) => ({
      ...category,
      slug: slugify(category.name)
    }));

    console.log('Inserting categories...');
    await Category.insertMany(categoriesToInsert);
    console.log('Categories inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

seed();