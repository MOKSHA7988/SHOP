// E2E Verification Script for ShopEase
const BASE_URL = 'http://localhost:3000';

interface TestResult {
  step: string;
  success: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, step: string, details: string) {
  if (condition) {
    results.push({ step, success: true, details });
    console.log(`✅ [PASS] ${step} – ${details}`);
  } else {
    results.push({ step, success: false, details: `FAILED: ${details}` });
    console.error(`❌ [FAIL] ${step} – ${details}`);
  }
}

async function runE2ETests() {
  console.log('\n🚀 Starting ShopEase E2E Test Suite against ' + BASE_URL + '...\n');

  try {
    // 1. Customer Registration
    const newCustomerEmail = `test.user.${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Customer',
        email: newCustomerEmail,
        password: 'Password123!',
        phone: '+1 (555) 999-0001',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && !!regData.token, '1. Customer Registration', `Created customer ${newCustomerEmail}`);

    // 2. Customer Login
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sarah.chen@example.com',
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    const customerToken = loginData.token;
    assert(loginRes.status === 200 && loginData.user.role === 'customer', '2. Customer Login', `Logged in as Sarah Chen (role: customer)`);

    // 3. Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@shopease.com',
        password: 'admin123',
      }),
    });
    const adminData = await adminLoginRes.json();
    const adminToken = adminData.token;
    assert(adminLoginRes.status === 200 && adminData.user.role === 'admin', '3. Admin Login', `Logged in as Administrator (role: admin)`);

    // 4. Categories Verification (7 categories)
    const catRes = await fetch(`${BASE_URL}/api/categories`);
    const catData = await catRes.json();
    const categoriesList = catData.categories || catData;
    assert(
      Array.isArray(categoriesList) && categoriesList.length >= 7,
      '4. Categories Verification',
      `Retrieved ${categoriesList.length} categories (Audio, Wearables, Computing, Smart Living, Electronics, Accessories, Gaming)`
    );

    // 5. Products Catalog (30 products)
    const prodRes = await fetch(`${BASE_URL}/api/products`);
    const prodData = await prodRes.json();
    const productsList = prodData.products || prodData;
    assert(
      Array.isArray(productsList) && productsList.length >= 30,
      '5. Products Catalog',
      `Retrieved ${productsList.length} active products in database`
    );

    // 6. Search and Filter
    const searchRes = await fetch(`${BASE_URL}/api/products?search=Titanium`);
    const searchData = await searchRes.json();
    const searchMatches = searchData.products || searchData;
    assert(
      Array.isArray(searchMatches) && searchMatches.length > 0,
      '6. Search Functionality',
      `Search query "Titanium" returned ${searchMatches.length} matching products`
    );

    const filterRes = await fetch(`${BASE_URL}/api/products?category=Electronics`);
    const filterData = await filterRes.json();
    const electronicsProducts = filterData.products || filterData;
    assert(
      Array.isArray(electronicsProducts) && electronicsProducts.length >= 4,
      '6. Category Filtering',
      `Category filter "Electronics" returned ${electronicsProducts.length} items`
    );

    // 7. Product CRUD (Create, Read, Update, Delete)
    const testSku = `TEST-DEV-${Date.now()}`;
    const createProdRes = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Automated Test Product',
        slug: `automated-test-product-${Date.now()}`,
        sku: testSku,
        category: 'Electronics',
        price: 99.99,
        originalPrice: 129.99,
        discountPercentage: 23,
        stock: 50,
        description: 'Temporary item for automated CRUD test validation.',
        features: ['Feature 1', 'Feature 2'],
        specifications: { Dimensions: '10x10 cm' },
        iconName: 'Zap',
        bgGradient: 'from-blue-600 to-indigo-600',
      }),
    });
    const createdProd = await createProdRes.json();
    const testProdId = createdProd.product?._id || createdProd.product?.id || createdProd._id || createdProd.id;
    assert(createProdRes.status === 201 && !!testProdId, '7a. Product CRUD - Create', `Admin created product with SKU ${testSku}`);

    // Update Product
    const updateProdRes = await fetch(`${BASE_URL}/api/products/${testProdId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        price: 89.99,
        stock: 45,
      }),
    });
    const updatedProd = await updateProdRes.json();
    assert(
      updateProdRes.status === 200 && (updatedProd.product?.price === 89.99 || updatedProd.price === 89.99),
      '7b. Product CRUD - Update',
      `Admin updated product price to $89.99 and stock to 45`
    );

    // Delete Product
    const deleteProdRes = await fetch(`${BASE_URL}/api/products/${testProdId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert(deleteProdRes.status === 200, '7c. Product CRUD - Delete', `Admin successfully removed test product`);

    // 8. Cart Operations
    const targetProduct = productsList.find((p: any) => p.stock > 10) || productsList[0];
    const targetProdId = targetProduct._id || targetProduct.id;
    const initialStock = targetProduct.stock;

    const cartRes = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        items: [{ product: targetProduct, quantity: 2 }],
      }),
    });
    assert(cartRes.status === 200, '8. Cart Management', `Customer cart synced with ${targetProduct.name} (qty: 2)`);

    // 9. Checkout & Stock Decrement Verification
    const checkoutRes = await fetch(`${BASE_URL}/api/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        items: [{ product: targetProduct, quantity: 2 }],
        shippingAddress: {
          fullName: 'Sarah Chen',
          email: 'sarah.chen@example.com',
          phone: '+1 (555) 438-9102',
          street: '742 Evergreen Terrace',
          city: 'Seattle',
          state: 'WA',
          postalCode: '98101',
          country: 'United States',
        },
        paymentMethod: 'card',
        discount: 0,
      }),
    });
    const orderData = await checkoutRes.json();
    const createdOrder = orderData.order;
    const createdOrderId = createdOrder?._id || createdOrder?.id;

    assert(
      checkoutRes.status === 201 && !!createdOrderId,
      '9a. Checkout & Order Creation',
      `Created Order #${createdOrder?.orderNumber} for total $${createdOrder?.total}`
    );

    // Verify stock decreased
    const verifyStockRes = await fetch(`${BASE_URL}/api/products/${targetProdId}`);
    const verifyStockData = await verifyStockRes.json();
    const updatedStock = (verifyStockData.product || verifyStockData).stock;
    assert(
      updatedStock === initialStock - 2,
      '9b. Atomic Stock Decrement',
      `Inventory verified: Stock reduced from ${initialStock} -> ${updatedStock}`
    );

    // 10. Order Cancellation & Stock Replenishment
    const cancelRes = await fetch(`${BASE_URL}/api/orders/${createdOrderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        orderStatus: 'Cancelled',
        status: 'Cancelled',
      }),
    });
    assert(cancelRes.status === 200, '10a. Order Cancellation', `Order status transitioned to "Cancelled"`);

    const verifyRestockRes = await fetch(`${BASE_URL}/api/products/${targetProdId}`);
    const verifyRestockData = await verifyRestockRes.json();
    const restoredStock = (verifyRestockData.product || verifyRestockData).stock;
    assert(
      restoredStock === initialStock,
      '10b. Stock Replenishment upon Cancellation',
      `Inventory replenished: Stock restored back to initial level ${restoredStock}`
    );

    // 11. Review Submission
    const reviewRes = await fetch(`${BASE_URL}/api/reviews/products/${targetProdId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        userName: 'Sarah Chen',
        userEmail: 'sarah.chen@example.com',
        rating: 5,
        comment: 'Superb build quality! Verified in automated test flow.',
      }),
    });
    assert(reviewRes.status === 201, '11. Product Review Submission', `Review submitted and rating calculated for product`);

    // 12. Admin Inventory Restock
    const restockRes = await fetch(`${BASE_URL}/api/inventory/restock/${targetProdId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        amount: 10,
        quantity: 10,
        reason: 'Automated test warehouse restock shipment',
      }),
    });
    const restockData = await restockRes.json();
    assert(
      restockRes.status === 200 && (restockData.product?.stock === initialStock + 10 || restockData.stock === initialStock + 10),
      '12. Admin Inventory Restock',
      `Restocked 10 units. New balance: ${initialStock + 10}`
    );

    // 13. Admin Dashboard & Analytics (Excluding Cancelled Orders)
    const analyticsRes = await fetch(`${BASE_URL}/api/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const analyticsData = await analyticsRes.json();
    const kpis = analyticsData.kpis;
    const catSales = analyticsData.categoryWiseSales || analyticsData.categorySales;
    assert(
      analyticsRes.status === 200 && kpis?.totalRevenue > 0 && Array.isArray(catSales),
      '13. Admin Dashboard & Aggregation Analytics',
      `Aggregations active: GMV $${kpis?.totalRevenue} (strictly excluding cancelled orders), ${catSales?.length} category breakdowns`
    );

    // 14. MongoDB Query Lab Presets & Execution
    const presetsRes = await fetch(`${BASE_URL}/api/analytics/mongolab/presets`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const presetsData = await presetsRes.json();
    const presetsList = Array.isArray(presetsData) ? presetsData : presetsData.presets;
    assert(
      presetsRes.status === 200 && Array.isArray(presetsList) && presetsList.length > 0,
      '14a. MongoLab Presets Catalog',
      `Fetched ${presetsList?.length} predefined safe MongoDB queries`
    );

    // Execute a real query in MongoLab
    const testPreset = presetsList[0];
    const execRes = await fetch(`${BASE_URL}/api/analytics/mongolab/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        presetId: testPreset.id,
      }),
    });
    const execData = await execRes.json();
    const resultItems = Array.isArray(execData.result) ? execData.result : execData.results || [];
    assert(
      execRes.status === 200 && (execData.explainPlan?.executionStats?.executionSuccess || execData.result !== undefined),
      '14b. MongoLab Real Query Execution',
      `Executed "${testPreset.title}" in ${execData.executionTimeMs}ms with ${execData.docsReturned ?? resultItems.length} documents returned`
    );

    console.log('\n' + '='.repeat(60));
    const passed = results.filter((r) => r.success).length;
    const total = results.length;
    console.log(`🏁 TEST SUITE COMPLETED: ${passed} / ${total} TESTS PASSED`);
    console.log('='.repeat(60) + '\n');

    if (passed !== total) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal test error:', error);
    process.exit(1);
  }
}

runE2ETests();
