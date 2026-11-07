export interface QueryPresetDef {
  id: string;
  title: string;
  operation: string;
  collection: 'products' | 'orders' | 'categories' | 'users' | 'reviews';
  category: 'CRUD Operations' | 'Atomic Modifiers ($set, $inc, $push, $pull)' | 'Aggregation Pipelines ($group, $unwind, $sum, $avg)' | 'Indexing & Text Search';
  description: string;
  mongoSyntax: string;
  sqlEquivalent: string;
  explanation: string;
}

export const QUERY_PRESETS: QueryPresetDef[] = [
  {
    id: 'find-audio-instock',
    title: 'Find In-Stock Audio Products with Projection & Sort',
    operation: 'find, projection, sort',
    collection: 'products',
    category: 'CRUD Operations',
    description: 'Queries in-stock audio products returning only specific fields, ordered by rating descending.',
    mongoSyntax: `db.products.find(
  { category: "Audio", stock: { $gt: 0 } },
  { name: 1, price: 1, stock: 1, rating: 1, sku: 1 }
).sort({ rating: -1 })`,
    sqlEquivalent: `SELECT name, price, stock, rating, sku 
FROM products 
WHERE category = 'Audio' AND stock > 0 
ORDER BY rating DESC;`,
    explanation: 'Uses BSON comparison operator $gt (greater than). The second parameter executes field projection at the storage engine level, returning only requested fields to minimize network overhead.',
  },
  {
    id: 'find-one-by-sku',
    title: 'Find Single Product Document by Unique SKU',
    operation: 'findOne',
    collection: 'products',
    category: 'CRUD Operations',
    description: 'Retrieves a single complete product document using unique SKU index.',
    mongoSyntax: `db.products.findOne(
  { sku: "AUD-UP-001" }
)`,
    sqlEquivalent: `SELECT * FROM products 
WHERE sku = 'AUD-UP-001' 
LIMIT 1;`,
    explanation: 'findOne returns the first matching document directly without an array cursor wrapper. Utilizes the unique index on { sku: 1 } for instant O(1) index lookup.',
  },
  {
    id: 'insert-one-demo',
    title: 'Insert Single Product Document (insertOne)',
    operation: 'insertOne',
    collection: 'products',
    category: 'CRUD Operations',
    description: 'Inserts a new product document with dynamic attributes and tags into the catalog.',
    mongoSyntax: `db.products.insertOne({
  name: "AeroPod Mini Earbuds (Demo)",
  sku: "AUD-DEMO-01",
  category: "Audio",
  price: 79.00,
  stock: 25,
  rating: 5.0,
  isDemo: true,
  features: ["Dynamic Bass", "USB-C Fast Charge"],
  createdAt: new Date()
})`,
    sqlEquivalent: `INSERT INTO products (name, sku, category, price, stock, rating, is_demo, created_at)
VALUES ('AeroPod Mini Earbuds (Demo)', 'AUD-DEMO-01', 'Audio', 79.00, 25, 5.0, TRUE, NOW());`,
    explanation: 'Demonstrates inserting a single BSON document. MongoDB automatically generates a unique 12-byte ObjectId (_id) containing a 4-byte timestamp, 5-byte random value, and 3-byte incrementing counter.',
  },
  {
    id: 'insert-many-demo',
    title: 'Batch Insert Multiple Verified Reviews (insertMany)',
    operation: 'insertMany',
    collection: 'reviews',
    category: 'CRUD Operations',
    description: 'Inserts an array of verified customer review documents in a single round-trip.',
    mongoSyntax: `db.reviews.insertMany([
  {
    productId: "prod-01",
    userName: "Elena Rostova",
    rating: 5,
    comment: "Exceptional acoustics for music production.",
    verifiedPurchase: true,
    isDemo: true,
    createdAt: new Date()
  },
  {
    productId: "prod-02",
    userName: "David Kim",
    rating: 5,
    comment: "Battery easily lasted my entire 5-day hike.",
    verifiedPurchase: true,
    isDemo: true,
    createdAt: new Date()
  }
])`,
    sqlEquivalent: `INSERT INTO reviews (product_id, user_name, rating, comment, verified_purchase, created_at)
VALUES 
  ('prod-01', 'Elena Rostova', 5, 'Exceptional acoustics for music production.', TRUE, NOW()),
  ('prod-02', 'David Kim', 5, 'Battery easily lasted my entire 5-day hike.', TRUE, NOW());`,
    explanation: 'insertMany provides high throughput batch insertion in an ordered sequence, minimizing round-trip network latency to the database cluster.',
  },
  {
    id: 'update-atomic-inc-set',
    title: 'Atomic Inventory Increment & Timestamp ($inc and $set)',
    operation: 'updateOne, $inc, $set',
    collection: 'products',
    category: 'Atomic Modifiers ($set, $inc, $push, $pull)',
    description: 'Increments inventory stock by +10 units while updating the modification timestamp.',
    mongoSyntax: `db.products.updateOne(
  { sku: "AUD-UP-001" },
  {
    $inc: { stock: 10 },
    $set: { lastRestockedAt: new Date(), badge: "Restocked" }
  }
)`,
    sqlEquivalent: `UPDATE products 
SET stock = stock + 10, 
    last_restocked_at = NOW(),
    badge = 'Restocked' 
WHERE sku = 'AUD-UP-001';`,
    explanation: '$inc atomically increments numeric values directly inside the document. It avoids the read-modify-write race condition hazard common in concurrent e-commerce systems.',
  },
  {
    id: 'update-many-warranty',
    title: 'Batch Update Documents Matching Condition (updateMany with $set)',
    operation: 'updateMany, $set',
    collection: 'products',
    category: 'Atomic Modifiers ($set, $inc, $push, $pull)',
    description: 'Applies an extended warranty policy field to all products in the Wearables category.',
    mongoSyntax: `db.products.updateMany(
  { category: "Wearables" },
  {
    $set: { warrantyTier: "2-Year Platinum Shield", eligibleForCare: true }
  }
)`,
    sqlEquivalent: `UPDATE products 
SET warranty_tier = '2-Year Platinum Shield',
    eligible_for_care = TRUE 
WHERE category = 'Wearables';`,
    explanation: 'updateMany modifies all documents matching the filter criteria. Fields that do not already exist in the document are dynamically created without requiring table schema alterations.',
  },
  {
    id: 'update-push-array',
    title: 'Append Feature Spec to Array Field ($push)',
    operation: 'updateOne, $push',
    collection: 'products',
    category: 'Atomic Modifiers ($set, $inc, $push, $pull)',
    description: 'Appends a new certification feature to the product features array.',
    mongoSyntax: `db.products.updateOne(
  { sku: "AUD-UP-001" },
  {
    $push: { features: "Certified Hi-Res Wireless Audio 96kHz/24bit" }
  }
)`,
    sqlEquivalent: `-- In SQL, this requires inserting a row into a separate product_features junction table:
INSERT INTO product_features (product_id, feature_name) 
VALUES (1, 'Certified Hi-Res Wireless Audio 96kHz/24bit');`,
    explanation: '$push appends an item to an existing array field within the document. In document databases, embedding arrays avoids foreign key joins across normalized tables.',
  },
  {
    id: 'update-pull-array',
    title: 'Remove Feature from Array Field ($pull)',
    operation: 'updateOne, $pull',
    collection: 'products',
    category: 'Atomic Modifiers ($set, $inc, $push, $pull)',
    description: 'Removes a specific feature element from the product features array.',
    mongoSyntax: `db.products.updateOne(
  { sku: "AUD-UP-001" },
  {
    $pull: { features: "Certified Hi-Res Wireless Audio 96kHz/24bit" }
  }
)`,
    sqlEquivalent: `-- In SQL:
DELETE FROM product_features 
WHERE product_id = 1 AND feature_name = 'Certified Hi-Res Wireless Audio 96kHz/24bit';`,
    explanation: '$pull removes all instances of a value or matching condition from an array. It executes atomically at the document level.',
  },
  {
    id: 'delete-one-demo',
    title: 'Delete Single Demo Record (deleteOne)',
    operation: 'deleteOne',
    collection: 'products',
    category: 'CRUD Operations',
    description: 'Safely deletes an ephemeral demo record, ensuring production catalog items are never affected.',
    mongoSyntax: `db.products.deleteOne(
  { isDemo: true }
)`,
    sqlEquivalent: `DELETE FROM products 
WHERE is_demo = TRUE 
LIMIT 1;`,
    explanation: 'deleteOne deletes at most one document matching the query selector, even if multiple documents match. To protect production data, this operation only targets demo-flagged documents.',
  },
  {
    id: 'aggregate-revenue-group',
    title: 'Revenue Aggregation Pipeline ($match, $group, $sort, $sum, $avg)',
    operation: '$match, $group, $sort, $sum, $avg',
    collection: 'orders',
    category: 'Aggregation Pipelines ($group, $unwind, $sum, $avg)',
    description: 'Filters out cancelled orders, groups by fulfillment status, and calculates total sales & AOV.',
    mongoSyntax: `db.orders.aggregate([
  {
    $match: { orderStatus: { $ne: "Cancelled" } }
  },
  {
    $group: {
      _id: "$orderStatus",
      totalRevenue: { $sum: "$total" },
      avgOrderValue: { $avg: "$total" },
      orderCount: { $sum: 1 }
    }
  },
  {
    $sort: { totalRevenue: -1 }
  }
])`,
    sqlEquivalent: `SELECT 
  order_status, 
  SUM(total) AS total_revenue, 
  AVG(total) AS avg_order_value, 
  COUNT(*) AS order_count 
FROM orders 
WHERE order_status != 'Cancelled' 
GROUP BY order_status 
ORDER BY total_revenue DESC;`,
    explanation: 'The MongoDB Aggregation Framework processes documents through an assembly-line pipeline. $match filters invalid records first, $group calculates $sum and $avg aggregates, and $sort orders the resulting stream.',
  },
  {
    id: 'aggregate-unwind-best-sellers',
    title: 'Best-Selling Products Pipeline ($unwind, $group, $sort, $project)',
    operation: '$unwind, $group, $sort, $project',
    collection: 'orders',
    category: 'Aggregation Pipelines ($group, $unwind, $sum, $avg)',
    description: 'Deconstructs the embedded items array from orders, aggregates units sold per product, and formats output.',
    mongoSyntax: `db.orders.aggregate([
  { $match: { orderStatus: { $ne: "Cancelled" } } },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.product.name",
      unitsSold: { $sum: "$items.quantity" },
      revenueGenerated: { $sum: "$items.totalItemAmount" }
    }
  },
  { $sort: { unitsSold: -1 } },
  {
    $project: {
      productName: "$_id",
      unitsSold: 1,
      revenueGenerated: 1,
      _id: 0
    }
  }
])`,
    sqlEquivalent: `SELECT 
  p.name AS product_name,
  SUM(oi.quantity) AS units_sold,
  SUM(oi.price * oi.quantity) AS revenue_generated
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
JOIN products p ON p.id = oi.product_id
WHERE o.order_status != 'Cancelled'
GROUP BY p.name
ORDER BY units_sold DESC;`,
    explanation: '$unwind flattens an array field, outputting one document for each element in the array. This allows downstream pipeline stages to aggregate and group on elements within embedded arrays.',
  },
  {
    id: 'text-search-index',
    title: 'Full-Text Search on Indexed Catalog ($text with $search)',
    operation: '$text search index',
    collection: 'products',
    category: 'Indexing & Text Search',
    description: 'Performs natural language keyword stemming and text relevance search across name and description.',
    mongoSyntax: `db.products.find(
  { $text: { $search: "wireless titanium studio" } },
  { score: { $meta: "textScore" }, name: 1, category: 1, price: 1 }
).sort({ score: { $meta: "textScore" } })`,
    sqlEquivalent: `-- In PostgreSQL:
SELECT name, category, price, ts_rank(to_tsvector('english', name || ' ' || description), query) AS score
FROM products, to_tsquery('wireless & (titanium | studio)') query
WHERE to_tsvector('english', name || ' ' || description) @@ query
ORDER BY score DESC;`,
    explanation: 'Leverages the compound text index on { name: "text", description: "text" }. MongoDB tokenizes words, strips language stop-words (e.g., "the", "in"), and scores results based on term frequency.',
  },
];
