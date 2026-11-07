import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {
  SEED_CATEGORIES,
  SEED_USERS,
  SEED_PRODUCTS,
  SEED_ORDERS,
  SEED_REVIEWS,
} from './seedData.ts';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.MONGODB_DB_NAME || 'shopease';

let client: MongoClient | null = null;
let db: Db | null = null;
let isConnectedToAtlas = false;

function matchItem(item: any, query: any): boolean {
  for (const key in query) {
    if (key === '$or') {
      if (Array.isArray(query.$or)) {
        const matchesAny = query.$or.some((subQuery: any) => matchItem(item, subQuery));
        if (!matchesAny) return false;
      }
    } else if (key === '_id') {
      const queryId = query._id?.toString ? query._id.toString() : query._id;
      const itemId = item._id?.toString ? item._id.toString() : item._id;
      if (queryId !== itemId) return false;
    } else if (typeof query[key] === 'object' && query[key] !== null) {
      const condition = query[key];
      if (condition.$gte !== undefined && item[key] < condition.$gte) return false;
      if (condition.$lte !== undefined && item[key] > condition.$lte) return false;
      if (condition.$gt !== undefined && item[key] <= condition.$gt) return false;
      if (condition.$lt !== undefined && item[key] >= condition.$lt) return false;
      if (condition.$in !== undefined && !condition.$in.includes(item[key])) return false;
      if (condition.$regex !== undefined) {
        const reg = new RegExp(condition.$regex, condition.$options || 'i');
        if (!reg.test(String(item[key] || ''))) return false;
      }
    } else if (item[key] !== query[key]) {
      return false;
    }
  }
  return true;
}

// In-memory fallback database store if Atlas URI is not yet configured or connecting
class LocalMemoryDb {
  collections: Record<string, any[]> = {
    users: [],
    products: [],
    categories: [],
    carts: [],
    orders: [],
    reviews: [],
    stock_logs: [],
  };

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    this.collections.users = JSON.parse(JSON.stringify(SEED_USERS)).map((u: any) => ({
      ...u,
      _id: new ObjectId(u._id),
    }));

    this.collections.categories = JSON.parse(JSON.stringify(SEED_CATEGORIES)).map((c: any) => ({
      ...c,
      _id: new ObjectId(c._id),
    }));

    this.collections.products = JSON.parse(JSON.stringify(SEED_PRODUCTS)).map((p: any) => ({
      ...p,
      _id: new ObjectId(p._id),
    }));

    this.collections.orders = JSON.parse(JSON.stringify(SEED_ORDERS)).map((o: any) => ({
      ...o,
      _id: new ObjectId(o._id),
    }));

    this.collections.reviews = JSON.parse(JSON.stringify(SEED_REVIEWS)).map((r: any) => ({
      ...r,
      _id: new ObjectId(r._id),
    }));
  }

  getCollection(name: string) {
    if (!this.collections[name]) {
      this.collections[name] = [];
    }
    const data = this.collections[name];

function resolveField(item: any, fieldRef: string): any {
  if (typeof fieldRef !== 'string' || !fieldRef.startsWith('$')) return fieldRef;
  const path = fieldRef.slice(1);
  const parts = path.split('.');
  let curr = item;
  for (const part of parts) {
    curr = curr ? curr[part] : undefined;
  }
  return curr;
}

    return {
      find: (query: any = {}) => {
        let items = data.filter(item => matchItem(item, query));
        let sortObj: any = null;
        let limitVal: number | null = null;
        let skipVal: number | null = null;

        const cursor = {
          sort: (s: any) => {
            sortObj = s;
            return cursor;
          },
          limit: (n: number) => {
            limitVal = n;
            return cursor;
          },
          skip: (n: number) => {
            skipVal = n;
            return cursor;
          },
          toArray: async () => {
            let res = [...items];
            if (sortObj) {
              const [field, dir] = Object.entries(sortObj)[0] || ['_id', 1];
              res.sort((a, b) => {
                if (a[field] < b[field]) return dir === 1 ? -1 : 1;
                if (a[field] > b[field]) return dir === 1 ? 1 : -1;
                return 0;
              });
            }
            if (skipVal) res = res.slice(skipVal);
            if (limitVal) res = res.slice(0, limitVal);
            return res;
          },
        };
        return cursor;
      },

      findOne: async (query: any) => {
        return data.find(item => matchItem(item, query)) || null;
      },

      distinct: async (field: string) => {
        const vals = data.map((item: any) => item[field]).filter(v => v !== undefined && v !== null);
        return [...new Set(vals)];
      },

      aggregate: (pipeline: any[] = []) => {
        let stream = JSON.parse(JSON.stringify(data));
        for (const stage of pipeline) {
          if (stage.$match) {
            stream = stream.filter((item: any) => matchItem(item, stage.$match));
          } else if (stage.$unwind) {
            const fieldPath = typeof stage.$unwind === 'string'
              ? stage.$unwind.replace(/^\$/, '')
              : stage.$unwind.path.replace(/^\$/, '');
            const unwound: any[] = [];
            stream.forEach((item: any) => {
              const val = item[fieldPath];
              if (Array.isArray(val)) {
                val.forEach((elem: any) => {
                  unwound.push({ ...item, [fieldPath]: elem });
                });
              } else if (val !== undefined) {
                unwound.push(item);
              }
            });
            stream = unwound;
          } else if (stage.$group) {
            const groupConfig = stage.$group;
            const idExpr = groupConfig._id;
            const groups: Record<string, any> = {};

            stream.forEach((item: any) => {
              let key = 'null';
              if (typeof idExpr === 'string' && idExpr.startsWith('$')) {
                const val = resolveField(item, idExpr);
                key = String(val !== undefined ? val : 'null');
              } else if (idExpr === null) {
                key = 'all';
              }

              if (!groups[key]) {
                groups[key] = {
                  _id: key === 'null' ? null : key,
                  _items: [],
                };
              }
              groups[key]._items.push(item);
            });

            const groupedList: any[] = [];
            for (const key in groups) {
              const grp = groups[key];
              const outObj: any = { _id: grp._id };

              for (const fieldName in groupConfig) {
                if (fieldName === '_id') continue;
                const acc = groupConfig[fieldName];
                if (acc.$sum !== undefined) {
                  if (typeof acc.$sum === 'number') {
                    outObj[fieldName] = grp._items.length * acc.$sum;
                  } else if (typeof acc.$sum === 'string' && acc.$sum.startsWith('$')) {
                    const sumField = acc.$sum.slice(1);
                    outObj[fieldName] = grp._items.reduce((s: number, it: any) => s + (Number(it[sumField]) || 0), 0);
                  } else if (typeof acc.$sum === 'object' && acc.$sum.$multiply) {
                    outObj[fieldName] = grp._items.reduce((s: number, it: any) => {
                      const [f1, f2] = acc.$sum.$multiply;
                      const v1 = Number(resolveField(it, f1)) || 0;
                      const v2 = Number(resolveField(it, f2)) || 1;
                      return s + (v1 * v2);
                    }, 0);
                  }
                } else if (acc.$avg !== undefined) {
                  const avgField = typeof acc.$avg === 'string' ? acc.$avg.slice(1) : '';
                  const total = grp._items.reduce((s: number, it: any) => s + (Number(it[avgField]) || 0), 0);
                  outObj[fieldName] = grp._items.length ? Number((total / grp._items.length).toFixed(2)) : 0;
                }
              }
              groupedList.push(outObj);
            }
            stream = groupedList;
          } else if (stage.$sort) {
            const [sortField, sortDir] = Object.entries(stage.$sort)[0] || ['_id', 1];
            stream.sort((a: any, b: any) => {
              if (a[sortField] < b[sortField]) return sortDir === 1 ? -1 : 1;
              if (a[sortField] > b[sortField]) return sortDir === 1 ? 1 : -1;
              return 0;
            });
          } else if (stage.$limit) {
            stream = stream.slice(0, stage.$limit);
          } else if (stage.$project) {
            stream = stream.map((item: any) => {
              const projected: any = {};
              for (const pk in stage.$project) {
                if (stage.$project[pk] === 1) {
                  projected[pk] = item[pk];
                } else if (stage.$project[pk] === 0 && pk === '_id') {
                  // omit _id
                } else if (typeof stage.$project[pk] === 'string' && stage.$project[pk].startsWith('$')) {
                  projected[pk] = resolveField(item, stage.$project[pk]);
                } else {
                  projected[pk] = item[pk];
                }
              }
              if (stage.$project._id === 0) delete projected._id;
              return projected;
            });
          }
        }
        return {
          toArray: async () => stream,
        };
      },

      insertOne: async (doc: any) => {
        const item = {
          ...doc,
          _id: doc._id || new ObjectId(),
        };
        data.push(item);
        return { acknowledged: true, insertedId: item._id };
      },

      insertMany: async (docs: any[]) => {
        const inserted = docs.map(d => ({ ...d, _id: d._id || new ObjectId() }));
        data.push(...inserted);
        return { acknowledged: true, insertedCount: inserted.length };
      },

      updateOne: async (query: any, update: any) => {
        const index = data.findIndex(item => matchItem(item, query));

        if (index === -1) return { matchedCount: 0, modifiedCount: 0 };

        const target = { ...data[index] };
        if (update.$set) {
          Object.assign(target, update.$set);
        }
        if (update.$inc) {
          for (const k in update.$inc) {
            target[k] = (target[k] || 0) + update.$inc[k];
          }
        }
        if (update.$push) {
          for (const k in update.$push) {
            if (!Array.isArray(target[k])) target[k] = [];
            target[k].push(update.$push[k]);
          }
        }
        data[index] = target;
        return { matchedCount: 1, modifiedCount: 1 };
      },

      deleteOne: async (query: any) => {
        const index = data.findIndex(item => matchItem(item, query));
        if (index > -1) {
          data.splice(index, 1);
          return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
      },

      countDocuments: async (query: any = {}) => {
        return data.length;
      },

      createIndex: async () => 'idx_created',
    };
  }
}

const localDb = new LocalMemoryDb();

export async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  if (MONGODB_URI && (MONGODB_URI.startsWith('mongodb://') || MONGODB_URI.startsWith('mongodb+srv://'))) {
    try {
      console.log(`[MongoDB] Connecting to Atlas at: ${MONGODB_URI.split('@')[1] || 'cluster'}...`);
      client = new MongoClient(MONGODB_URI, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      });
      await client.connect();
      db = client.db(DB_NAME);
      isConnectedToAtlas = true;
      console.log(`[MongoDB] Successfully connected to MongoDB Atlas database: "${DB_NAME}"`);

      // Initialize collections, indexes and seed data
      await initializeDatabase(db);
      return db;
    } catch (err: any) {
      console.warn(`[MongoDB Atlas] Connection failed (${err.message}). Using local high-fidelity MongoDB engine fallback.`);
      isConnectedToAtlas = false;
    }
  } else {
    console.log('[MongoDB] Notice: MONGODB_URI not set or is placeholder in .env. Running on internal BSON database engine.');
  }

  // Fallback to local memory db wrapper
  return {
    collection: (name: string) => localDb.getCollection(name),
  } as unknown as Db;
}

export function isAtlasConnected(): boolean {
  return isConnectedToAtlas;
}

// Ensures collections, indexes, and initial data seeding
async function initializeDatabase(database: Db) {
  try {
    const usersCol = database.collection('users');
    const productsCol = database.collection('products');
    const categoriesCol = database.collection('categories');
    const ordersCol = database.collection('orders');
    const cartsCol = database.collection('carts');
    const reviewsCol = database.collection('reviews');

    // Create Indexes
    await usersCol.createIndex({ email: 1 }, { unique: true });
    await productsCol.createIndex({ sku: 1 }, { unique: true });
    await productsCol.createIndex({ slug: 1 });
    await productsCol.createIndex({ category: 1, rating: -1 });
    await productsCol.createIndex({ name: 'text', description: 'text' });
    await categoriesCol.createIndex({ name: 1 }, { unique: true });
    await ordersCol.createIndex({ orderNumber: 1 }, { unique: true });
    await ordersCol.createIndex({ customerId: 1, createdAt: -1 });
    await cartsCol.createIndex({ userId: 1 }, { unique: true });
    await reviewsCol.createIndex({ productId: 1, createdAt: -1 });

    // Seed default admin if missing
    const adminExists = await usersCol.findOne({ email: 'admin@shopease.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await usersCol.insertOne({
        id: 'usr-admin',
        name: 'Administrator',
        email: 'admin@shopease.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+1 (555) 019-2834',
        avatarColor: 'bg-indigo-600',
        savedAddresses: [],
        joinedAt: new Date().toISOString(),
      });
      console.log('[MongoDB] Seeded default administrator: admin@shopease.com / admin123');
    }

    // Seed default customer Sarah Chen if missing
    const customerExists = await usersCol.findOne({ email: 'sarah.chen@example.com' });
    if (!customerExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await usersCol.insertOne({
        id: 'usr-sarah',
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        password: hashedPassword,
        role: 'customer',
        phone: '+1 (555) 438-9102',
        avatarColor: 'bg-violet-600',
        savedAddresses: [
          {
            id: 'addr-1',
            fullName: 'Sarah Chen',
            email: 'sarah.chen@example.com',
            phone: '+1 (555) 438-9102',
            street: '742 Evergreen Terrace',
            city: 'Seattle',
            state: 'WA',
            postalCode: '98101',
            country: 'United States',
            isDefault: true,
          },
        ],
        totalOrders: 2,
        totalSpent: 795.96,
        joinedAt: new Date().toISOString(),
      });
      console.log('[MongoDB] Seeded default customer: sarah.chen@example.com / password123');
    }

    // Seed products if collection is empty
    const productCount = await productsCol.countDocuments();
    if (productCount === 0) {
      const productsToInsert = SEED_PRODUCTS.map((p: any) => ({
        ...p,
        _id: p._id ? new ObjectId(p._id) : new ObjectId(),
      }));
      await productsCol.insertMany(productsToInsert as any);
      console.log(`[MongoDB] Seeded ${productsToInsert.length} initial products.`);
    }

    // Seed categories if empty
    const catCount = await categoriesCol.countDocuments();
    if (catCount === 0) {
      const catsToInsert = SEED_CATEGORIES.map((c: any) => ({
        ...c,
        _id: new ObjectId(c._id),
      }));
      await categoriesCol.insertMany(catsToInsert as any);
      console.log(`[MongoDB] Seeded ${catsToInsert.length} initial categories.`);
    }

    // Seed orders if empty
    const orderCount = await ordersCol.countDocuments();
    if (orderCount === 0) {
      const ordersToInsert = SEED_ORDERS.map((o: any) => ({
        ...o,
        _id: o._id ? new ObjectId(o._id) : new ObjectId(),
      }));
      await ordersCol.insertMany(ordersToInsert as any);
      console.log(`[MongoDB] Seeded ${ordersToInsert.length} initial orders.`);
    }
  } catch (seedErr) {
    console.error('[MongoDB] Initialization error:', seedErr);
  }
}
