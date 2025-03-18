import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: join(__dirname, '..', 'config.env') });

async function connectDB() {
  try {
    // Check if we're already connected
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to the database');
      return mongoose.connection;
    }

    // Verify environment variable exists
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    }
    // Connect to MongoDB
    await mongoose.connect(mongoUri, options);
    
    const db = mongoose.connection;

    db.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    db.once('open', () => {
      console.log('Database connection opened');
    });

    console.log('Connected to the database');
    return db;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
}

export { connectDB };