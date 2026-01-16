import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
  deleteUser,
} from '../services/authService';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    const user = await registerUser({ name, email, password });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.message === 'User already exists with this email') {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    const token = await loginUser({ email, password });

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error: any) {
    if (error.message === 'Wrong password') {
      res.status(401).json({ message: 'Wrong password. Please re-enter.' });
      return;
    }
    if (error.message === 'User not found') {
      res.status(404).json({ message: 'User not found. Please sign up.' });
      return;
    }
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { name, email } = req.body as { name?: string; email?: string };

    if (name !== undefined && !String(name).trim()) {
      res.status(400).json({ message: 'Name cannot be empty' });
      return;
    }

    if (email !== undefined && !/^\S+@\S+\.\S+$/.test(String(email))) {
      res.status(400).json({ message: 'Please provide a valid email' });
      return;
    }

    const updated = await updateUserProfile(userId, {
      ...(name !== undefined ? { name: String(name).trim() } : {}),
      ...(email !== undefined ? { email: String(email).toLowerCase().trim() } : {}),
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
      },
    });
  } catch (error: any) {
    if (error.message === 'Email already in use') {
      res.status(409).json({ message: error.message });
      return;
    }
    if (error.message === 'User not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

export const deleteAccount = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    await deleteUser(userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting account' });
  }
};
