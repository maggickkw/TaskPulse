import multer from 'multer';

const storage = multer.memoryStorage();

// Configure multer with detailed error handling
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'profilePicture', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]); // Accept multiple possible field names

export const uploadMiddleware = (req: any, res: any, next: any) => {
  upload(req, res, (err) => {
    // Log incoming request details
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Files received:', req.files);

    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({
        message: `Multer error: ${err.message}`,
        code: err.code,
        field: err.field,
        details: err
      });
    } else if (err) {
      console.error('Unknown error:', err);
      return res.status(500).json({ message: `Unknown error: ${err.message}` });
    }

    // Log successful file upload
    if (req.files) {
      console.log('Files after processing:', Object.keys(req.files));
    }

    next();
  });
};
