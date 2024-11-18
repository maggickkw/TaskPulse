import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginInput, RegisterInput, UserPayload } from '../types/auth.types';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from "streamifier";

const prisma = new PrismaClient();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '72h' });
};

const uploadToCloudinary = async (fileBuffer: Buffer): Promise<string> => {
  try {
    const uploadStream = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'user_profiles',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload stream error:', error);
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });

    console.log('Cloudinary upload successful:', uploadStream.secure_url);
    return uploadStream.secure_url;
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw error;
  }
};

// Register function
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Starting registration process');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required!' });
      return;
    }


    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }


    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const uploadedFile = files?.file?.[0] || files?.profilePicture?.[0] || files?.image?.[0];
    let profilePictureUrl = null;

    if (uploadedFile?.buffer) {
      try {
        console.log('Starting Cloudinary upload');
        profilePictureUrl = await uploadToCloudinary(uploadedFile.buffer);
        console.log('Profile picture URL:', profilePictureUrl);
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        res.status(500).json({ message: 'Error uploading profile picture' });
        return;
      }
    } else {
      console.log('No profile picture provided');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        profilePictureUrl
      },
      select: {
        userId: true,
        username: true,
        profilePictureUrl: true,
        teamId: true
      }
    });

    const token = generateToken({ userId: user.userId, username: user.username });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error creating user', error: errorMessage });
  }
};

// Login function
export const login = async (req: Request<{}, {}, LoginInput>, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required!" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: { userId: true, username: true, password: true, profilePictureUrl: true, teamId: true },
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken({ userId: user.userId, username: user.username });
    const tokenExpiry = 24 * 60 * 60; // 24 hours in seconds

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      tokenExpiry,
      user: userWithoutPassword,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error logging in', error: errorMessage });
  }
};
