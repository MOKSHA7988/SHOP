import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/db';
import { generateToken } from '../middleware/auth';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const db = await connectToDatabase();
    const usersCol = db.collection('users');

    const existingUser = await usersCol.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr-${Date.now()}`;
    const mongoId = new ObjectId();

    const newUser = {
      _id: mongoId,
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'customer',
      phone: phone || '',
      avatarColor: 'bg-indigo-600',
      savedAddresses: [],
      totalOrders: 0,
      totalSpent: 0,
      joinedAt: new Date().toISOString(),
    };

    await usersCol.insertOne(newUser);

    const token = generateToken({
      id: userId,
      _id: mongoId.toString(),
      email: newUser.email,
      name: newUser.name,
      role: 'customer',
    });

    // Exclude password from response
    const { password: _, ...userProfile } = newUser;

    res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: userProfile,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const db = await connectToDatabase();
    const usersCol = db.collection('users');

    const user = await usersCol.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Verify hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = generateToken({
      id: user.id || user._id.toString(),
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const { password: _, ...userProfile } = user;

    res.json({
      message: 'Login successful.',
      token,
      user: userProfile,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    const db = await connectToDatabase();
    const usersCol = db.collection('users');

    const user = await usersCol.findOne({ email: req.user.email });
    if (!user) {
      res.status(404).json({ error: 'User profile not found.' });
      return;
    }

    const { password: _, ...userProfile } = user;
    res.json(userProfile);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    const { name, phone } = req.body;
    const db = await connectToDatabase();
    const usersCol = db.collection('users');

    const updates: any = {};
    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();

    await usersCol.updateOne({ email: req.user.email }, { $set: updates });

    const updatedUser = await usersCol.findOne({ email: req.user.email });
    if (!updatedUser) {
      res.status(404).json({ error: 'User profile not found.' });
      return;
    }
    const { password: _, ...userProfile } = updatedUser as any;

    res.json({ message: 'Profile updated successfully.', user: userProfile });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
}

export async function addAddress(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    const { fullName, email, phone, street, city, state, postalCode, country, isDefault } = req.body;
    if (!fullName || !street || !city || !postalCode) {
      res.status(400).json({ error: 'Missing required address fields.' });
      return;
    }

    const db = await connectToDatabase();
    const usersCol = db.collection('users');

    const newAddress = {
      id: `addr-${Date.now()}`,
      fullName,
      email: email || req.user.email,
      phone: phone || '',
      street,
      city,
      state: state || '',
      postalCode,
      country: country || 'United States',
      isDefault: Boolean(isDefault),
    };

    const user = await usersCol.findOne({ email: req.user.email });
    let addresses = user?.savedAddresses || [];

    if (newAddress.isDefault || addresses.length === 0) {
      addresses = addresses.map((a: any) => ({ ...a, isDefault: false }));
      newAddress.isDefault = true;
    }

    addresses.push(newAddress);

    await usersCol.updateOne({ email: req.user.email }, { $set: { savedAddresses: addresses } });

    res.status(201).json({ message: 'Address added.', addresses });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add address.' });
  }
}

export async function deleteAddress(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    const { addressId } = req.params;
    const db = await connectToDatabase();
    const usersCol = db.collection('users');

    const user = await usersCol.findOne({ email: req.user.email });
    let addresses = (user?.savedAddresses || []).filter((a: any) => a.id !== addressId);

    if (addresses.length > 0 && !addresses.some((a: any) => a.isDefault)) {
      addresses[0].isDefault = true;
    }

    await usersCol.updateOne({ email: req.user.email }, { $set: { savedAddresses: addresses } });

    res.json({ message: 'Address removed.', addresses });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete address.' });
  }
}

export async function setDefaultAddress(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    const { addressId } = req.params;
    const db = await connectToDatabase();
    const usersCol = db.collection('users');

    const user = await usersCol.findOne({ email: req.user.email });
    const addresses = (user?.savedAddresses || []).map((a: any) => ({
      ...a,
      isDefault: a.id === addressId,
    }));

    await usersCol.updateOne({ email: req.user.email }, { $set: { savedAddresses: addresses } });

    res.json({ message: 'Default address updated.', addresses });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to set default address.' });
  }
}
