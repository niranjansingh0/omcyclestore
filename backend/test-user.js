import connectDB from './config/db.js';
import { User } from './models/index.js';

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    console.log('Creating user...');
    await User.create({
      name: 'Admin User',
      email: 'admin@omcyclestore.com',
      password: 'Admin@123',
      phone: '9876543210',
      role: 'admin'
    });
    console.log('User created successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

seed();