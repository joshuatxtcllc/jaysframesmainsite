
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { storage } from '../storage';
import type { User, InsertUser } from '@shared/schema';

// JWT secret - in production, this should be a strong random string
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validation schemas
export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export interface AuthResult {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  message?: string;
}

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  static generateToken(user: Omit<User, 'password'>): string {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isAdmin: user.isAdmin,
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Register new user
  static async register(userData: z.infer<typeof registerSchema>): Promise<AuthResult> {
    try {
      // Validate input
      const validatedData = registerSchema.parse(userData);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      // Check if username is taken
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return {
          success: false,
          message: 'Username is already taken'
        };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(validatedData.password);

      // Create user
      const newUser: InsertUser = {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        role: 'customer',
      };

      const user = await storage.createUser(newUser);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      // Generate token
      const token = this.generateToken(userWithoutPassword);

      return {
        success: true,
        user: userWithoutPassword,
        token,
        message: 'User registered successfully'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof z.ZodError ? 'Invalid input data' : 'Registration failed'
      };
    }
  }

  // Login user
  static async login(credentials: z.infer<typeof loginSchema>): Promise<AuthResult> {
    try {
      // Validate input
      const validatedData = loginSchema.parse(credentials);

      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(validatedData.password, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      // Generate token
      const token = this.generateToken(userWithoutPassword);

      return {
        success: true,
        user: userWithoutPassword,
        token,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof z.ZodError ? 'Invalid input data' : 'Login failed'
      };
    }
  }

  // Get user profile
  static async getProfile(userId: number): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await storage.getUserById(userId);
      if (!user) {
        return null;
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  // Update user profile
  static async updateProfile(userId: number, updates: Partial<Omit<User, 'id' | 'password' | 'createdAt'>>): Promise<AuthResult> {
    try {
      const user = await storage.updateUser(userId, updates);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Failed to update profile'
      };
    }
  }
}
