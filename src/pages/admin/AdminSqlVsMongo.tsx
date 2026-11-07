import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Sparkles, 
  Check, 
  Code2, 
  ArrowLeftRight, 
  Play,
  Clock,
  Table as TableIcon,
  AlertCircle,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Copy,
  Terminal
} from 'lucide-react';
import { dataService } from '../../services/dataService';

interface ComparisonTopic {
  id: string;
  title: string;
  shortLabel: string;
  iconName: string;
  description: string;
  sqlCode: string;
  executableSql: string;
  mongoCode: string;
  executableMongo: string;
  keyDifferences: string[];
  ecommerceAdvantage: string;
}

const COMPARISON_TOPICS: ComparisonTopic[] = [
  {
    id: 'tables-vs-collections',
    title: 'Tables vs. Collections',
    shortLabel: 'Tables vs Collections',
    iconName: 'table',
    description: 'Relational 2D rigid tables vs flexible document-oriented collections.',
    sqlCode: `-- SQL: Predefining static tables with foreign key constraints
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(64) UNIQUE NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Querying the rigid relational schema:
SELECT id, name, category, price, stock FROM products LIMIT 5;`,
    executableSql: `SELECT id, name, category, price, stock FROM products LIMIT 5;`,
    mongoCode: `// MongoDB: Self-contained BSON documents in the 'products' collection
db.products.find({}, { name: 1, sku: 1, category: 1, price: 1, stock: 1, features: 1 }).limit(5);`,
    executableMongo: `db.products.find({}, { name: 1, sku: 1, category: 1, price: 1, stock: 1, features: 1 }).limit(5);`,
    keyDifferences: [
      'SQL requires rigid columns defined up-front; adding new attributes requires ALTER TABLE migrations.',
      'MongoDB collections store dynamic BSON documents that can hold nested objects, arrays, and polymorphic fields natively.',
      'MongoDB assigns a 12-byte BSON ObjectId ("_id") by default, enabling distributed unique ID generation without auto-increment bottlenecks.',
    ],
    ecommerceAdvantage: 'Allows selling electronics with technical specs, apparel with size/color matrices, and digital goods in a single catalog collection without thousands of sparse columns or entity-attribute-value (EAV) anti-patterns.',
  },
  {
    id: 'fixed-vs-flexible',
    title: 'Fixed Schemas vs. Flexible Documents',
    shortLabel: 'Fixed vs Flexible Schemas',
    iconName: 'file',
    description: 'Schema migrations and ALTER TABLE downtime vs dynamic BSON document evolution.',
    sqlCode: `-- SQL: Schema Evolution requires locking table alterations
ALTER TABLE products ADD COLUMN warranty_tier STRING;
UPDATE products SET warranty_tier = 'Standard 1-Year' WHERE warranty_tier IS NULL;

-- Querying the altered schema:
SELECT id, name, category, warranty_tier FROM products LIMIT 5;`,
    executableSql: `ALTER TABLE products ADD COLUMN warranty_tier STRING;
UPDATE products SET warranty_tier = 'Standard 1-Year' WHERE warranty_tier IS NULL;
SELECT id, name, category, warranty_tier FROM products LIMIT 5;`,
    mongoCode: `// MongoDB: Schema evolution happens naturally at application runtime
db.products.find({ category: "Wearables" }).limit(3);`,
    executableMongo: `db.products.find({ category: "Wearables" }).limit(3);`,
    keyDifferences: [
      'SQL schema changes can lock high-volume production tables for hours during catalog migrations.',
      'MongoDB documents are self-describing; different documents in the same collection can have distinct or optional fields.',
      'MongoDB allows gradual phased rollouts: new versions of products can introduce new fields without breaking older consumer queries.',
    ],
    ecommerceAdvantage: 'Marketing teams can launch new product categories with unexpected attributes (e.g. battery chemistry, eco-friendly certifications) in minutes rather than waiting weeks for database migration windows.',
  },
  {
    id: 'joins-vs-embedded',
    title: 'SQL Joins vs. Embedded Documents',
    shortLabel: 'Joins vs Embedded Docs',
    iconName: 'fork',
    description: 'Multi-table JOIN overhead vs self-contained immutable order snapshots.',
    sqlCode: `-- SQL: Multi-table JOIN to retrieve an order with line items and customer
SELECT 
  o.order_number,
  c.name AS customer_name,
  c.email,
  oi.product_name,
  oi.price_snapshot,
  oi.quantity,
  (oi.price_snapshot * oi.quantity) AS item_total
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN order_items oi ON o.id = oi.order_id
WHERE o.order_number = 'ORD-2026-9041';`,
    executableSql: `SELECT 
  o.order_number,
  c.name AS customer_name,
  c.email,
  oi.product_name,
  oi.price_snapshot,
  oi.quantity,
  (oi.price_snapshot * oi.quantity) AS item_total
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN order_items oi ON o.id = oi.order_id
WHERE o.order_number = 'ORD-2026-9041';`,
    mongoCode: `// MongoDB: Embedded Document Architecture (Single O(1) Index Lookup)
db.orders.findOne({ orderNumber: "ORD-2026-9041" });`,
    executableMongo: `db.orders.findOne({ orderNumber: "ORD-2026-9041" });`,
    keyDifferences: [
      'SQL normalizes orders into orders and order_items tables, requiring costly JOIN operations during every receipt or history lookup.',
      'MongoDB embeds line items directly inside the order document, creating an immutable historic record that never mutates if catalog prices change.',
      'Single-document reads in MongoDB eliminate join contention and secondary disk seeks, delivering sub-millisecond query responses.',
    ],
    ecommerceAdvantage: 'Order receipts must never change even if a product is later renamed or discounted. Embedded documents guarantee historic data integrity naturally.',
  },
  {
    id: 'groupby-vs-aggregation',
    title: 'GROUP BY vs. Aggregation Pipelines',
    shortLabel: 'GROUP BY vs Aggregation',
    iconName: 'chart',
    description: 'Declarative SQL GROUP BY vs multi-stage functional pipelines ($match, $group, $sort, $unwind).',
    sqlCode: `-- SQL: Category sales analysis excluding cancelled orders
SELECT 
  p.category,
  COUNT(DISTINCT o.id) AS total_orders,
  SUM(oi.quantity) AS units_sold,
  SUM(oi.price_snapshot * oi.quantity) AS category_revenue
FROM orders o
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
WHERE o.order_status <> 'Cancelled'
GROUP BY p.category
ORDER BY category_revenue DESC
LIMIT 5;`,
    executableSql: `SELECT 
  p.category,
  COUNT(DISTINCT o.id) AS total_orders,
  SUM(oi.quantity) AS units_sold,
  SUM(oi.price_snapshot * oi.quantity) AS category_revenue
FROM orders o
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
WHERE o.order_status <> 'Cancelled'
GROUP BY p.category
ORDER BY category_revenue DESC
LIMIT 5;`,
    mongoCode: `// MongoDB: Multi-Stage Aggregation Pipeline
db.orders.aggregate([
  { $match: { orderStatus: { $ne: "Cancelled" } } },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.product.category",
      totalRevenue: { $sum: { $multiply: ["$items.priceSnapshot", "$items.quantity"] } },
      unitsSold: { $sum: "$items.quantity" }
    }
  },
  { $sort: { totalRevenue: -1 } },
  { $limit: 5 }
]);`,
    executableMongo: `db.orders.aggregate([
  { $match: { orderStatus: { $ne: "Cancelled" } } },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.product.category",
      totalRevenue: { $sum: { $multiply: ["$items.priceSnapshot", "$items.quantity"] } },
      unitsSold: { $sum: "$items.quantity" }
    }
  },
  { $sort: { totalRevenue: -1 } },
  { $limit: 5 }
]);`,
    keyDifferences: [
      'SQL GROUP BY operates on flat relational rows with fixed aggregation functions (SUM, COUNT, AVG).',
      'MongoDB Aggregation Pipelines operate as functional UNIX-style streams where the output of each stage feeds the next.',
      '$unwind enables array flattening that would require recursive CTEs or cross-joins in relational databases.',
    ],
    ecommerceAdvantage: 'Enables real-time analytics for best-sellers, monthly revenue trajectories, and category sales without ETL pipelines or dedicated reporting warehouses.',
  },
  {
    id: 'reviews-relational-vs-embedded',
    title: 'Relational Reviews vs. Embedded Document Examples',
    shortLabel: 'Relational Reviews vs Embedded',
    iconName: 'star',
    description: 'Separate reviews table with foreign keys vs subset pattern embedded reviews + cached stats.',
    sqlCode: `-- SQL: Normalized reviews table requiring joins & runtime aggregate recalculation
SELECT 
  p.id, p.name, p.price,
  AVG(r.rating) AS average_rating,
  COUNT(r.id) AS total_reviews
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
WHERE p.id = '1'
GROUP BY p.id, p.name, p.price;`,
    executableSql: `SELECT 
  p.id, p.name, p.price,
  AVG(r.rating) AS average_rating,
  COUNT(r.id) AS total_reviews
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
WHERE p.id = '1'
GROUP BY p.id, p.name, p.price;`,
    mongoCode: `// MongoDB: The "Subset Pattern" (Cached Ratings + Embedded Recent Reviews)
db.products.findOne({ _id: "prod-01" });`,
    executableMongo: `db.products.findOne({ _id: "prod-01" });`,
    keyDifferences: [
      'In SQL, displaying a product catalog with ratings requires joining thousands of review rows and running AVG() dynamically.',
      'In MongoDB, the Subset Pattern stores the top 3-5 reviews and cached rating aggregates directly in the product document for instant O(1) reads.',
      'Full review histories can still reside in a separate "reviews" collection with infinite pagination, giving the best of both worlds.',
    ],
    ecommerceAdvantage: 'Prevents the dreaded "N+1 query problem" when rendering a page of 24 products with star ratings and recent review quotes.',
  },
];

const PRESET_SQL_QUERIES = [
  {
    label: 'Top 5 Expensive Products',
    sql: 'SELECT name, category, price, stock, rating FROM products ORDER BY price DESC LIMIT 5;',
  },
  {
    label: 'Category Inventory & Price Summary',
    sql: 'SELECT category, COUNT(*) as product_count, AVG(price) as avg_price, SUM(stock) as total_stock FROM products GROUP BY category ORDER BY product_count DESC;',
  },
  {
    label: 'Orders with Customer JOIN',
    sql: `SELECT o.order_number, o.customer_name, o.customer_email, o.total_amount, o.order_status 
FROM orders o 
LIMIT 5;`,
  },
  {
    label: 'Low Stock Alert (< 15 Units)',
    sql: 'SELECT name, category, stock, price FROM products WHERE stock < 15 ORDER BY stock ASC;',
  },
  {
    label: 'Order Items Line Item Detail',
    sql: `SELECT oi.order_number, oi.product_name, oi.price_snapshot, oi.quantity, oi.item_total 
FROM order_items oi 
LIMIT 5;`,
  },
];

export const AdminSqlVsMongo: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<string>('tables-vs-collections');
  const [isExecutingSql, setIsExecutingSql] = useState(false);
  const [isExecutingMongo, setIsExecutingMongo] = useState(false);
  
  // Topic-specific execution outputs
  const [topicSqlResult, setTopicSqlResult] = useState<{
    columns: string[];
    rows: any[];
    rowCount: number;
    executionTimeMs: number;
    error?: string;
  } | null>(null);

  const [topicMongoResult, setTopicMongoResult] = useState<{
    result: any;
    executionTimeMs: number;
    docsReturned: number;
    error?: string;
  } | null>(null);

  // Dedicated SQL Console state
  const [consoleSql, setConsoleSql] = useState<string>(PRESET_SQL_QUERIES[0].sql);
  const [consoleResult, setConsoleResult] = useState<{
    success: boolean;
    columns: string[];
    rows: any[];
    rowCount: number;
    executionTimeMs: number;
    error?: string;
  } | null>(null);
  const [isConsoleRunning, setIsConsoleRunning] = useState(false);

  const currentTopic = COMPARISON_TOPICS.find(t => t.id === activeTopicId) || COMPARISON_TOPICS[0];

  const handleRunTopicSql = async () => {
    setIsExecutingSql(true);
    try {
      const res = await dataService.executeSqlQuery(currentTopic.executableSql);
      setTopicSqlResult(res);
    } catch (err: any) {
      setTopicSqlResult({
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: err?.message || 'SQL execution failed',
      });
    } finally {
      setIsExecutingSql(false);
    }
  };

  const handleRunTopicMongo = async () => {
    setIsExecutingMongo(true);
    try {
      const res = await dataService.executeMongoQuery(undefined, currentTopic.executableMongo);
      setTopicMongoResult({
        result: res.result,
        executionTimeMs: res.executionTimeMs,
        docsReturned: res.docsReturned,
      });
    } catch (err: any) {
      setTopicMongoResult({
        result: null,
        executionTimeMs: 0,
        docsReturned: 0,
        error: err?.message || 'MongoDB execution failed',
      });
    } finally {
      setIsExecutingMongo(false);
    }
  };

  const handleRunBothBenchmark = async () => {
    await Promise.all([handleRunTopicSql(), handleRunTopicMongo()]);
  };

  const handleRunConsoleSql = async () => {
    setIsConsoleRunning(true);
    try {
      const res = await dataService.executeSqlQuery(consoleSql);
      setConsoleResult(res);
    } catch (err: any) {
      setConsoleResult({
        success: false,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: err?.message || 'SQL execution failed',
      });
    } finally {
      setIsConsoleRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              SQL vs. MongoDB Architectural Comparison
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Database Architecture
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> All Queries Directly Executable
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deep-dive technical comparison of relational RDBMS (PostgreSQL/MySQL) vs. document-oriented NoSQL (MongoDB Atlas) in modern e-commerce.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunBothBenchmark}
          disabled={isExecutingSql || isExecutingMongo}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <ArrowLeftRight className="w-4 h-4 text-amber-400" />
          <span>Run Both & Compare Performance</span>
        </button>
      </div>

      {/* 5 Prominent User-Requested Topic Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-1 border-b border-slate-200">
        {COMPARISON_TOPICS.map(topic => (
          <button
            key={topic.id}
            type="button"
            onClick={() => {
              setActiveTopicId(topic.id);
              setTopicSqlResult(null);
              setTopicMongoResult(null);
            }}
            className={`p-3 rounded-2xl text-xs font-bold text-left transition-all flex flex-col justify-between border ${
              activeTopicId === topic.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider opacity-70">Topic</span>
            <span className="mt-1 font-extrabold line-clamp-2 leading-tight">{topic.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Active Topic Banner & Advantage */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>E-Commerce Architectural Impact: {currentTopic.title}</span>
        </div>
        <p className="text-sm text-blue-50 leading-relaxed font-medium">
          {currentTopic.ecommerceAdvantage}
        </p>
      </div>

      {/* Side-by-Side Code Comparison & Executable Queries */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{currentTopic.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{currentTopic.description}</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Topic ID: <strong>{currentTopic.id}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Relational SQL Block with Live Run Button */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg flex flex-col">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="font-bold text-blue-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" /> Relational SQL (Postgres / MySQL)
              </span>
              <button
                type="button"
                onClick={handleRunTopicSql}
                disabled={isExecutingSql}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] font-bold flex items-center gap-1.5 shadow transition-colors disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{isExecutingSql ? 'Running...' : 'Run SQL Query'}</span>
              </button>
            </div>
            
            <pre className="p-4 text-xs font-mono text-blue-200 overflow-x-auto whitespace-pre leading-relaxed grow max-h-[260px]">
              {currentTopic.sqlCode}
            </pre>

            {/* SQL Output Tray */}
            {topicSqlResult && (
              <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-blue-400">SQL Result:</span>
                    <span className="text-slate-400 text-[11px]">
                      {topicSqlResult.rowCount} {topicSqlResult.rowCount === 1 ? 'row' : 'rows'}
                    </span>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {topicSqlResult.executionTimeMs} ms
                  </span>
                </div>

                {topicSqlResult.error ? (
                  <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-900 text-rose-300 text-xs font-mono">
                    {topicSqlResult.error}
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[220px] rounded-lg border border-slate-800">
                    <table className="w-full text-xs font-mono text-left">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] sticky top-0">
                        <tr>
                          {topicSqlResult.columns.map(col => (
                            <th key={col} className="p-2 border-b border-slate-800 whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950 text-slate-200">
                        {topicSqlResult.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/50">
                            {topicSqlResult.columns.map(col => (
                              <td key={col} className="p-2 whitespace-nowrap text-slate-300">
                                {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MongoDB Document NoSQL Block with Live Run Button */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg flex flex-col">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" /> MongoDB Document NoSQL (BSON)
              </span>
              <button
                type="button"
                onClick={handleRunTopicMongo}
                disabled={isExecutingMongo}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[11px] font-bold flex items-center gap-1.5 shadow transition-colors disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{isExecutingMongo ? 'Running...' : 'Run MongoDB'}</span>
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed grow max-h-[260px]">
              {currentTopic.mongoCode}
            </pre>

            {/* MongoDB Output Tray */}
            {topicMongoResult && (
              <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">BSON Result:</span>
                    <span className="text-slate-400 text-[11px]">
                      {topicMongoResult.docsReturned} docs returned
                    </span>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {topicMongoResult.executionTimeMs} ms
                  </span>
                </div>

                {topicMongoResult.error ? (
                  <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-900 text-rose-300 text-xs font-mono">
                    {topicMongoResult.error}
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[220px] rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-xs font-mono text-emerald-300">
                    <pre className="whitespace-pre">
                      {JSON.stringify(topicMongoResult.result, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Key Architectural Takeaways */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Key Architectural Takeaways
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            {currentTopic.keyDifferences.map((diff, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{diff}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* DEDICATED INTERACTIVE SQL RUNNER CONSOLE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-extrabold text-white">Interactive SQL Query Console</h3>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                Live Relational Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Type or customize any SQL query against <code className="text-blue-300">products</code>, <code className="text-blue-300">categories</code>, <code className="text-blue-300">orders</code>, <code className="text-blue-300">order_items</code>, <code className="text-blue-300">customers</code>, or <code className="text-blue-300">reviews</code>.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunConsoleSql}
            disabled={isConsoleRunning}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isConsoleRunning ? 'Executing SQL...' : 'Execute SQL Query'}</span>
          </button>
        </div>

        {/* Quick SQL Templates Bar */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-slate-400 font-medium block">
            Click a preset template to load:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {PRESET_SQL_QUERIES.map(q => (
              <button
                key={q.label}
                type="button"
                onClick={() => setConsoleSql(q.sql)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
                  consoleSql.trim() === q.sql.trim()
                    ? 'bg-blue-600/30 text-blue-200 border-blue-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editable SQL Textarea */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-blue-200">
          <textarea
            value={consoleSql}
            onChange={e => setConsoleSql(e.target.value)}
            rows={5}
            spellCheck={false}
            placeholder="SELECT * FROM products WHERE price < 100 ORDER BY price DESC LIMIT 10;"
            className="w-full bg-transparent focus:outline-none resize-y leading-relaxed text-blue-300"
          />
        </div>

        {/* Console Execution Results */}
        {consoleResult && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-300">Execution Output:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-blue-400">
                  {consoleResult.rowCount} {consoleResult.rowCount === 1 ? 'row' : 'rows'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                  {consoleResult.columns.length} columns
                </span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5" /> {consoleResult.executionTimeMs} ms
              </span>
            </div>

            {consoleResult.error ? (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-900 text-rose-300 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{consoleResult.error}</span>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 max-h-[320px]">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0 border-b border-slate-800">
                    <tr>
                      {consoleResult.columns.map(col => (
                        <th key={col} className="p-3 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 text-slate-300">
                    {consoleResult.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50">
                        {consoleResult.columns.map(col => (
                          <td key={col} className="p-3 whitespace-nowrap">
                            {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comprehensive Architectural Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
          SQL vs. MongoDB E-Commerce Engineering Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">Architectural Dimension</th>
                <th className="p-3.5">Relational SQL</th>
                <th className="p-3.5">MongoDB Document NoSQL</th>
                <th className="p-3.5">ShopEase Real-World Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Tables vs. Collections</td>
                <td className="p-3.5 text-slate-600">Fixed columns, strict 2D tabular relations</td>
                <td className="p-3.5 text-slate-600">Collections of dynamic BSON documents</td>
                <td className="p-3.5 text-blue-700 font-semibold">Catalog attributes vary by category without sparse columns</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Fixed Schemas vs. Flexible</td>
                <td className="p-3.5 text-slate-600">ALTER TABLE DDL migrations required</td>
                <td className="p-3.5 text-slate-600">Dynamic fields + optional $jsonSchema validation</td>
                <td className="p-3.5 text-blue-700 font-semibold">Instant product feature additions without database downtime</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Joins vs. Embedded Docs</td>
                <td className="p-3.5 text-slate-600">Normalization in orders & order_items</td>
                <td className="p-3.5 text-slate-600">Embedded line items in order documents</td>
                <td className="p-3.5 text-blue-700 font-semibold">O(1) checkout snapshots; immutable purchase prices</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">GROUP BY vs. Aggregations</td>
                <td className="p-3.5 text-slate-600">Flat tabular GROUP BY & HAVING</td>
                <td className="p-3.5 text-slate-600">Multi-stage pipelines ($match, $group, $unwind)</td>
                <td className="p-3.5 text-blue-700 font-semibold">Real-time revenue aggregations excluding cancelled orders</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Reviews & Ratings Model</td>
                <td className="p-3.5 text-slate-600">Runtime AVG(rating) join on every product view</td>
                <td className="p-3.5 text-slate-600">Subset Pattern: cached rating + embedded top reviews</td>
                <td className="p-3.5 text-blue-700 font-semibold">Pre-computed average rating on products for 0ms card latency</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
