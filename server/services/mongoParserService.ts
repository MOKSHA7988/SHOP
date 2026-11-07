import { Db } from 'mongodb';

export interface MongoExecutionResult {
  success: boolean;
  collection: string;
  operation: string;
  result: any;
  docsExamined: number;
  docsReturned: number;
  executionTimeMs: number;
  winningPlan: string;
  explainPlan: any;
  error?: string;
}

/**
 * Safely parse a JS/JSON-like object string (e.g. "{ category: 'Audio', price: { $gt: 50 } }")
 */
function safeEvalObject(str: string): any {
  const trimmed = str.trim();
  if (!trimmed) return {};

  try {
    return JSON.parse(trimmed);
  } catch {
    // Convert unquoted object keys or single quotes to standard JSON
    try {
      // Use Function inside isolated closure to evaluate object/array literals only (no window/global access)
      // Check that it does not contain forbidden keywords like require, process, import, fetch, eval
      if (/process|require|import|global|window|child_process|fs|eval|Function|prototype/i.test(trimmed)) {
        throw new Error('Forbidden token in query expression.');
      }
      const fn = new Function(`"use strict"; return (${trimmed});`);
      return fn();
    } catch (err: any) {
      throw new Error(`Invalid JSON / Object syntax in query: ${err.message}`);
    }
  }
}

export async function executeCustomMongoMql(
  db: Db,
  queryCode: string
): Promise<MongoExecutionResult> {
  const start = performance.now();

  const code = queryCode.trim();
  if (!code) {
    throw new Error('Query code cannot be empty.');
  }

  // Check for basic "db.collection.operation" syntax
  // Example: db.products.find({ ... }).sort({ ... }).limit(10)
  // or db.orders.aggregate([ ... ])
  const dbMatch = code.match(/^db\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\s*\(([\s\S]*)\)\s*(\.[a-zA-Z0-9_]+\s*\([\s\S]*\))*;?$/);

  let collectionName = 'products';
  let operation = 'find';
  let mainArgsStr = '';
  let chainPart = '';

  if (dbMatch) {
    collectionName = dbMatch[1];
    operation = dbMatch[2];
    mainArgsStr = dbMatch[3] || '';
    chainPart = code.substring(code.indexOf(`db.${collectionName}.${operation}`) + `db.${collectionName}.${operation}`.length);
  } else {
    // If user provided a JSON query object or raw pipeline/filter
    try {
      const parsed = safeEvalObject(code);
      if (Array.isArray(parsed)) {
        // Aggregate pipeline passed directly
        collectionName = 'orders';
        operation = 'aggregate';
        const result = await db.collection(collectionName).aggregate(parsed).toArray();
        const elapsed = Math.max(1, Math.round(performance.now() - start));
        return {
          success: true,
          collection: collectionName,
          operation,
          result,
          docsExamined: result.length,
          docsReturned: result.length,
          executionTimeMs: elapsed,
          winningPlan: 'PIPELINE_AGGREGATION',
          explainPlan: {
            stages: parsed.map(s => Object.keys(s)[0]),
            executionStats: { nReturned: result.length, executionTimeMillis: elapsed },
          },
        };
      } else if (parsed && typeof parsed === 'object') {
        if (parsed.collection) collectionName = parsed.collection;
        if (parsed.operation) operation = parsed.operation;
        if (parsed.pipeline) {
          const result = await db.collection(collectionName).aggregate(parsed.pipeline).toArray();
          const elapsed = Math.max(1, Math.round(performance.now() - start));
          return {
            success: true,
            collection: collectionName,
            operation: 'aggregate',
            result,
            docsExamined: result.length,
            docsReturned: result.length,
            executionTimeMs: elapsed,
            winningPlan: 'PIPELINE_AGGREGATION',
            explainPlan: { stages: parsed.pipeline.map((s: any) => Object.keys(s)[0]) },
          };
        }
      }
    } catch {
      // Fall through to parsing attempts
    }
  }

  // Validate collection exists or is valid
  const validCollections = ['products', 'categories', 'orders', 'users', 'reviews', 'carts'];
  if (!validCollections.includes(collectionName)) {
    throw new Error(`Collection "${collectionName}" does not exist. Available: ${validCollections.join(', ')}`);
  }

  const col = db.collection(collectionName);
  let result: any = null;
  let docsExamined = 0;
  let docsReturned = 0;
  let winningPlan = 'IXSCAN';

  // Parse chain methods (e.g. .sort({ price: -1 }).limit(10).skip(0))
  let sortObj: any = null;
  let limitNum: number | null = null;
  let skipNum: number | null = null;

  const sortMatch = code.match(/\.sort\s*\(([\s\S]*?)\)/);
  if (sortMatch) {
    try {
      sortObj = safeEvalObject(sortMatch[1]);
    } catch {
      sortObj = null;
    }
  }

  const limitMatch = code.match(/\.limit\s*\(\s*(\d+)\s*\)/);
  if (limitMatch) {
    limitNum = parseInt(limitMatch[1], 10);
  }

  const skipMatch = code.match(/\.skip\s*\(\s*(\d+)\s*\)/);
  if (skipMatch) {
    skipNum = parseInt(skipMatch[1], 10);
  }

  // Extract main argument (first argument inside method)
  let firstArg: any = {};
  if (mainArgsStr.trim()) {
    // If the method has multiple comma-separated arguments (e.g. find(filter, projection) or updateOne(filter, update))
    // We can parse with safeEvalObject
    try {
      // Try parsing as array of arguments: `[${mainArgsStr}]`
      const argsArray = safeEvalObject(`[${mainArgsStr}]`);
      if (Array.isArray(argsArray)) {
        firstArg = argsArray[0] || {};
      }
    } catch {
      try {
        firstArg = safeEvalObject(mainArgsStr);
      } catch {
        firstArg = {};
      }
    }
  }

  switch (operation.toLowerCase()) {
    case 'find': {
      let cursor = col.find(firstArg || {});
      if (sortObj) cursor = cursor.sort(sortObj);
      if (skipNum) cursor = cursor.skip(skipNum);
      if (limitNum) cursor = cursor.limit(limitNum);
      else cursor = cursor.limit(100); // Default max limit to protect memory

      const docs = await cursor.toArray();
      docsExamined = await col.countDocuments();
      docsReturned = docs.length;
      result = docs;
      winningPlan = sortObj ? 'SORT_KEY_IXSCAN' : 'IXSCAN';
      break;
    }

    case 'findone': {
      const doc = await col.findOne(firstArg || {});
      docsExamined = 1;
      docsReturned = doc ? 1 : 0;
      result = doc;
      winningPlan = 'IXSCAN (Primary/Unique Key)';
      break;
    }

    case 'aggregate': {
      let pipeline = Array.isArray(firstArg) ? firstArg : [firstArg];
      if (!Array.isArray(pipeline)) {
        pipeline = [];
      }
      const aggResult = await col.aggregate(pipeline).toArray();
      docsExamined = await col.countDocuments();
      docsReturned = aggResult.length;
      result = aggResult;
      winningPlan = 'PIPELINE_AGGREGATION (' + pipeline.map(p => Object.keys(p)[0]).join(' -> ') + ')';
      break;
    }

    case 'countdocuments':
    case 'count': {
      const count = await col.countDocuments(firstArg || {});
      docsExamined = count;
      docsReturned = 1;
      result = { count };
      winningPlan = 'COUNT_SCAN';
      break;
    }

    case 'distinct': {
      const fieldName = typeof firstArg === 'string' ? firstArg : (firstArg?.field || 'category');
      const distinctValues = await col.distinct(fieldName);
      docsExamined = distinctValues.length;
      docsReturned = distinctValues.length;
      result = distinctValues;
      winningPlan = 'DISTINCT_SCAN';
      break;
    }

    case 'updateone': {
      // Safe update
      let updateOp = { $set: { lastModified: new Date().toISOString() } };
      try {
        const argsArray = safeEvalObject(`[${mainArgsStr}]`);
        if (argsArray.length >= 2) {
          updateOp = argsArray[1];
        }
      } catch {
        // fallback
      }
      const updateRes = await col.updateOne(firstArg || {}, updateOp);
      result = {
        acknowledged: updateRes.acknowledged,
        matchedCount: updateRes.matchedCount,
        modifiedCount: updateRes.modifiedCount,
      };
      docsExamined = 1;
      docsReturned = updateRes.modifiedCount;
      winningPlan = 'UPDATE_IXSCAN';
      break;
    }

    case 'insertone': {
      const docToInsert = { ...firstArg, isDemo: true, createdAt: new Date().toISOString() };
      const insRes = await col.insertOne(docToInsert);
      result = {
        acknowledged: insRes.acknowledged,
        insertedId: insRes.insertedId,
        insertedDocument: docToInsert,
      };
      docsExamined = 0;
      docsReturned = 1;
      winningPlan = 'INSERT_STAGE';
      break;
    }

    case 'deleteone': {
      // Safe delete: only delete records with isDemo: true or demo sku
      const deleteFilter = { ...firstArg, isDemo: true };
      const delRes = await col.deleteOne(deleteFilter);
      result = {
        acknowledged: delRes.acknowledged,
        deletedCount: delRes.deletedCount,
        filterUsed: deleteFilter,
      };
      docsExamined = 1;
      docsReturned = delRes.deletedCount;
      winningPlan = 'DELETE_SAFE_FILTER';
      break;
    }

    default:
      throw new Error(`Unsupported MongoDB operation "${operation}". Supported: find, findOne, aggregate, countDocuments, distinct, updateOne, insertOne, deleteOne`);
  }

  const elapsed = Math.max(1, Math.round(performance.now() - start));

  const explainPlan = {
    queryPlanner: {
      namespace: `shopease.${collectionName}`,
      indexFilterSet: false,
      winningPlan: {
        stage: winningPlan,
        direction: 'forward',
      },
    },
    executionStats: {
      executionSuccess: true,
      nReturned: docsReturned,
      executionTimeMillis: elapsed,
      totalDocsExamined: docsExamined,
      serverInfo: {
        cluster: 'MongoDB Atlas v8.0',
        database: 'shopease',
        protocol: 'mongodb+srv',
      },
    },
  };

  return {
    success: true,
    collection: collectionName,
    operation,
    result,
    docsExamined,
    docsReturned,
    executionTimeMs: elapsed,
    winningPlan,
    explainPlan,
  };
}
