import { RequestHandler } from 'express';
import { RegisterInput, LoginInput } from '../types/auth.types';

// Middleware for validating register input
export const validateRegisterInput: RequestHandler<{}, any, RegisterInput> = (
  req,
  res,
  next
) => {
  const { username, password } = req.body;
  const profilePicture = req.file; // `req.file` will hold the uploaded file if present

  // Validate username
  if (!username || typeof username !== 'string') {
    res.status(400).json({ message: 'Valid username is required' });
    return;
  }

  // Validate password
  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters long' });
    return;
  }

  // Optional: Validate profile picture (if provided)
  if (profilePicture && !profilePicture.mimetype.startsWith('image/')) {
    res.status(400).json({ message: 'Profile picture must be an image file' });
    return;
  }

  next();
};

// Middleware for validating login input
export const validateLoginInput: RequestHandler<{}, any, LoginInput> = (
  req,
  res,
  next
) => {
  const { username, password } = req.body;

  if (!username || typeof username !== 'string') {
    res.status(400).json({ message: 'Valid username is required' });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters long' });
    return;
  }

  next();
};
