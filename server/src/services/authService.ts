import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Task from '../models/Task';
import { IUser } from '../models/User';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData): Promise<IUser> => {
  const { name, email, password } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();
  return user;
};

export const loginUser = async (data: LoginData): Promise<string> => {
  const { email, password } = data;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Wrong password');
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_SECRET || '',
    { expiresIn: '7d' }
  );

  return token;
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  return (await User.findById(userId).select('-password')) as unknown as IUser | null;
};

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export const updateUserProfile = async (
  userId: string,
  data: UpdateProfileData
): Promise<IUser> => {
  if (data.email) {
    const existing = await User.findOne({ email: data.email, _id: { $ne: userId } });
    if (existing) {
      throw new Error('Email already in use');
    }
  }

  const updated = (await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true }
  ).select('-password')) as unknown as IUser | null;

  if (!updated) {
    throw new Error('User not found');
  }

  return updated;
};

export const deleteUser = async (userId: string): Promise<void> => {
  // Delete user
  await User.findByIdAndDelete(userId);
  // Delete associated tasks
  await Task.deleteMany({ userId });
};
