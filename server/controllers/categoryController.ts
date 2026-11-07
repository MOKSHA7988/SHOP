import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/db';

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const db = await connectToDatabase();
    const categoriesCol = db.collection('categories');
    const productsCol = db.collection('products');

    const categories = await categoriesCol.find().toArray();
    const products = await productsCol.find().toArray();

    // Calculate actual live product counts per category
    const counts: Record<string, number> = {};
    products.forEach((p: any) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const enriched = categories.map((cat: any) => ({
      ...cat,
      itemCount: counts[cat.name] || 0,
    }));

    res.json(enriched);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const { name, description, icon, gradient, image, bannerImage, subcategories } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Category name is required.' });
      return;
    }

    const db = await connectToDatabase();
    const categoriesCol = db.collection('categories');

    const existing = await categoriesCol.findOne({ name: name.trim() });
    if (existing) {
      res.status(409).json({ error: 'Category with this name already exists.' });
      return;
    }

    const newCat = {
      _id: new ObjectId(),
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || `Curated collection of ${name.trim()}.`,
      icon: icon || 'Boxes',
      itemCount: 0,
      gradient: gradient || 'from-blue-600 to-indigo-600',
      image: image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
      subcategories: Array.isArray(subcategories) ? subcategories : [],
    };

    await categoriesCol.insertOne(newCat);
    res.status(201).json({ message: 'Category created.', category: newCat });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create category.' });
  }
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, description, icon, gradient, image, bannerImage, subcategories } = req.body;

    const db = await connectToDatabase();
    const categoriesCol = db.collection('categories');

    let query: any = { id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { id }] };
    }

    const updateDoc: any = {};
    if (name) {
      updateDoc.name = name.trim();
      updateDoc.slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (description !== undefined) updateDoc.description = description.trim();
    if (icon) updateDoc.icon = icon;
    if (gradient) updateDoc.gradient = gradient;
    if (image) updateDoc.image = image;
    if (bannerImage) updateDoc.bannerImage = bannerImage;
    if (Array.isArray(subcategories)) updateDoc.subcategories = subcategories;

    await categoriesCol.updateOne(query, { $set: updateDoc });
    const updated = await categoriesCol.findOne(query);

    res.json({ message: 'Category updated.', category: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update category.' });
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    const categoriesCol = db.collection('categories');

    let query: any = { id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { id }] };
    }

    await categoriesCol.deleteOne(query);
    res.json({ message: 'Category deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete category.' });
  }
}
