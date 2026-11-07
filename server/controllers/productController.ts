import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/db';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const { category, subcategory, brand, search, minPrice, maxPrice, minRating, inStock, onSale, isDeal, isTrending, isNewArrival, sort } = req.query;
    const db = await connectToDatabase();
    const productsCol = db.collection('products');

    const query: any = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (subcategory && subcategory !== 'All') {
      query.subcategory = subcategory;
    }

    if (brand && brand !== 'All') {
      query.brand = brand;
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    if (isDeal === 'true' || onSale === 'true') {
      query.$or = [{ isDeal: true }, { discountPercentage: { $gt: 0 } }, { originalPrice: { $gt: 0 } }];
    }

    if (isTrending === 'true') {
      query.isTrending = true;
    }

    if (isNewArrival === 'true') {
      query.isNewArrival = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { sku: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { subcategory: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }

    let sortObj: any = { isFeatured: -1, rating: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };
    else if (sort === 'popularity') sortObj = { ratingCount: -1, rating: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };

    const cursor = productsCol.find(query).sort(sortObj);
    const products = await cursor.toArray();

    res.json(products);
  } catch (err: any) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to retrieve products.' });
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    const productsCol = db.collection('products');

    let query: any = { id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { id }, { slug: id }] };
    } else {
      query = { $or: [{ id }, { slug: id }] };
    }

    const product = await productsCol.findOne(query);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve product details.' });
  }
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const { name, category, subcategory, brand, price, originalPrice, stock, sku, description, badge, features, specifications, isFeatured, isTrending, isDeal, isNewArrival, image, images } = req.body;

    if (!name || price === undefined) {
      res.status(400).json({ error: 'Product name and price are required.' });
      return;
    }

    const db = await connectToDatabase();
    const productsCol = db.collection('products');

    const generatedSku = sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    const existingSku = await productsCol.findOne({ sku: generatedSku });
    if (existingSku) {
      res.status(409).json({ error: 'A product with this SKU already exists.' });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newId = `prod-${Date.now()}`;
    const mongoId = new ObjectId();

    const normalizedImages = Array.isArray(images) && images.length > 0 
      ? images 
      : image 
      ? [image] 
      : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'];

    const productDoc = {
      _id: mongoId,
      id: newId,
      name: name.trim(),
      slug,
      sku: generatedSku,
      category: category || 'Electronics',
      subcategory: subcategory || '',
      brand: brand || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discountPercentage: originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      stock: Number(stock) || 0,
      rating: 5.0,
      ratingCount: 0,
      description: description || 'Engineered with precision materials.',
      features: features || ['Precision engineering', '1-Year warranty', 'Fast dispatch'],
      specifications: specifications || { 'Warranty': '12 Months' },
      badge: badge || 'New',
      iconName: 'Package',
      bgGradient: 'from-blue-600 to-indigo-600',
      image: normalizedImages[0],
      images: normalizedImages,
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending),
      isDeal: Boolean(isDeal),
      isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : true,
      reviews: [],
      createdAt: new Date().toISOString(),
    };

    await productsCol.insertOne(productDoc);

    res.status(201).json({ message: 'Product created successfully.', product: productDoc });
  } catch (err: any) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product.' });
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updates = req.body;

    const db = await connectToDatabase();
    const productsCol = db.collection('products');

    let query: any = { id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { id }] };
    }

    const existing = await productsCol.findOne(query);
    if (!existing) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    const updateDoc: any = { ...updates };
    delete updateDoc._id;
    delete updateDoc.id;

    if (updateDoc.price !== undefined) updateDoc.price = Number(updateDoc.price);
    if (updateDoc.stock !== undefined) updateDoc.stock = Number(updateDoc.stock);
    if (updateDoc.originalPrice !== undefined) updateDoc.originalPrice = Number(updateDoc.originalPrice);

    await productsCol.updateOne(query, { $set: updateDoc });

    const updated = await productsCol.findOne(query);
    res.json({ message: 'Product updated successfully.', product: updated });
  } catch (err: any) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product.' });
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    const productsCol = db.collection('products');

    let query: any = { id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { id }] };
    }

    const result = await productsCol.deleteOne(query);
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    res.json({ message: 'Product deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
}
