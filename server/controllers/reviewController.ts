import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/db';

export async function addReview(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.params;
    const { rating, comment, userName } = req.body;

    if (!rating || !comment) {
      res.status(400).json({ error: 'Rating (1-5) and comment are required.' });
      return;
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      res.status(400).json({ error: 'Rating must be between 1 and 5.' });
      return;
    }

    const db = await connectToDatabase();
    const productsCol = db.collection('products');
    const reviewsCol = db.collection('reviews');

    let prodQuery: any = { id: productId };
    if (ObjectId.isValid(productId)) {
      prodQuery = { $or: [{ _id: new ObjectId(productId) }, { id: productId }] };
    }

    const product = await productsCol.findOne(prodQuery);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    const reviewDoc = {
      _id: new ObjectId(),
      id: `rev-${Date.now()}`,
      productId: product.id || product._id.toString(),
      userName: userName || req.user?.name || 'Verified Shopper',
      userEmail: req.user?.email || 'customer@shopease.com',
      rating: numRating,
      comment: comment.trim(),
      verifiedPurchase: true,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
    };

    await reviewsCol.insertOne(reviewDoc);

    // Update product reviews array and calculate new average rating
    const currentReviews = product.reviews || [];
    currentReviews.unshift(reviewDoc);
    const sumRatings = currentReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    const newAverage = Number((sumRatings / currentReviews.length).toFixed(1));

    await productsCol.updateOne(prodQuery, {
      $set: {
        reviews: currentReviews,
        rating: newAverage,
        ratingCount: currentReviews.length,
      },
    });

    const updatedProduct = await productsCol.findOne(prodQuery);

    res.status(201).json({
      message: 'Review submitted successfully.',
      review: reviewDoc,
      product: updatedProduct,
    });
  } catch (err: any) {
    console.error('Add review error:', err);
    res.status(500).json({ error: 'Failed to submit review.' });
  }
}

export async function getProductReviews(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.params;
    const db = await connectToDatabase();
    const reviewsCol = db.collection('reviews');

    const reviews = await reviewsCol.find({ productId }).sort({ createdAt: -1 }).toArray();
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve reviews.' });
  }
}
