import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import {
  SEED_CATEGORIES,
  SEED_USERS,
  SEED_PRODUCTS,
  SEED_ORDERS,
  SEED_REVIEWS,
} from '../config/seedData.ts';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'shopease';

export async function runDatabaseSeed(targetUri?: string) {
  const uri = targetUri || MONGODB_URI;

  console.log('='.repeat(60));
  console.log('🌱 ShopEase E-Commerce System – Database Seeder');
  console.log('='.repeat(60));

  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not set in environment or .env file.');
    console.log('ℹ️  The application in-memory fallback will automatically load this exact');
    console.log('   dataset on dev server startup.');
    console.log('   To seed a live MongoDB Atlas cluster, set MONGODB_URI in .env:');
    console.log('   MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/shopease?retryWrites=true&w=majority"');
    console.log('   Then run: npm run seed');
    console.log('='.repeat(60));
    return {
      success: true,
      inMemoryOnly: true,
      summary: {
        adminUsers: 1,
        customers: 10,
        categories: SEED_CATEGORIES.length,
        products: SEED_PRODUCTS.length,
        orders: SEED_ORDERS.length,
        reviews: SEED_REVIEWS.length,
      },
    };
  }

  const client = new MongoClient(uri);

  try {
    console.log(`📡 Connecting to MongoDB instance...`);
    await client.connect();
    console.log(`✅ Connected successfully.`);

    const db = client.db(DB_NAME);
    console.log(`📂 Target Database: "${DB_NAME}"`);

    // 1. Users collection
    console.log(`\n👤 Seeding "users" collection...`);
    await db.collection('users').deleteMany({});
    const userResult = await db.collection('users').insertMany(SEED_USERS as any);
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    console.log(`   ✓ Seeded ${userResult.insertedCount} users (1 Admin + 10 Demo Customers)`);

    // 2. Categories collection
    console.log(`\n🏷️  Seeding "categories" collection...`);
    await db.collection('categories').deleteMany({});
    const catResult = await db.collection('categories').insertMany(SEED_CATEGORIES as any);
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    await db.collection('categories').createIndex({ name: 1 }, { unique: true });
    console.log(`   ✓ Seeded ${catResult.insertedCount} categories`);

    // 3. Products collection
    console.log(`\n📦 Seeding "products" collection...`);
    await db.collection('products').deleteMany({});
    const prodResult = await db.collection('products').insertMany(SEED_PRODUCTS as any);
    await db.collection('products').createIndex({ sku: 1 }, { unique: true });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ stock: 1 });
    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    console.log(`   ✓ Seeded ${prodResult.insertedCount} products with text search and compound indexes`);

    // 4. Orders collection
    console.log(`\n📋 Seeding "orders" collection...`);
    await db.collection('orders').deleteMany({});
    const orderResult = await db.collection('orders').insertMany(SEED_ORDERS as any);
    await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    await db.collection('orders').createIndex({ customerId: 1 });
    await db.collection('orders').createIndex({ orderStatus: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    console.log(`   ✓ Seeded ${orderResult.insertedCount} orders (including cancelled, delivered, shipped, pending)`);

    // 5. Reviews collection
    console.log(`\n⭐ Seeding "reviews" collection...`);
    await db.collection('reviews').deleteMany({});
    const revResult = await db.collection('reviews').insertMany(SEED_REVIEWS as any);
    await db.collection('reviews').createIndex({ productId: 1 });
    await db.collection('reviews').createIndex({ userEmail: 1 });
    console.log(`   ✓ Seeded ${revResult.insertedCount} sample reviews`);

    // 6. Carts collection (initialize index)
    console.log(`\n🛒 Initializing "carts" collection indexes...`);
    await db.collection('carts').createIndex({ userId: 1 }, { unique: true });
    console.log(`   ✓ Initialized cart indexes`);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 MongoDB Atlas Seeding Finished Successfully!');
    console.log(`   - 1 Super Administrator (admin@shopease.com)`);
    console.log(`   - 10 Realistic Demo Customers with addresses`);
    console.log(`   - 7 Product Categories`);
    console.log(`   - 30 High-Fidelity Products across 7 departments`);
    console.log(`   - 20 Commercial Orders`);
    console.log(`   - 8 Verified Customer Reviews`);
    console.log('='.repeat(60));

    return {
      success: true,
      inMemoryOnly: false,
      summary: {
        users: userResult.insertedCount,
        categories: catResult.insertedCount,
        products: prodResult.insertedCount,
        orders: orderResult.insertedCount,
        reviews: revResult.insertedCount,
      },
    };
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Direct execution via CLI
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('seed.ts')) {
  runDatabaseSeed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
