    console.log('Server starting...');

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import multer, { FileFilterCallback } from 'multer';
import webpackConfig from '../webpack.config';

// Types
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Constants
const PORT = process.env.PORT || 3000;
// Express app setup
const app = express();
const isDevelopment = process.env.NODE_ENV === 'development';

// Webpack setup for development
if (isDevelopment) {
  const compiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output?.publicPath || '/',
    })
  );
  app.use(webpackHotMiddleware(compiler));
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (
    req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    // Default to a common images directory since we don't have project context here
    const imagePath = path.join(__dirname, '../projects/images');
    
    // Ensure directory exists
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath, { recursive: true });
    }
    cb(null, imagePath);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

// Image upload route handler type
type UploadHandler = (req: MulterRequest, res: Response) => void;

// Image upload route
const handleImageUpload: UploadHandler = (req, res) => {
  if (!req.file) {
    const response: ApiResponse = { error: 'No image file provided or invalid file type' };
    return res.status(400).json(response);
  }

  const response: ApiResponse<{ filename: string; path: string }> = {
    message: 'Image uploaded successfully',
    data: {
      filename: req.file.filename,
      path: req.file.path
    }
  };
  res.json(response);
};

app.post('/api/images/upload', upload.single('image'), handleImageUpload);

// Get images route
app.get('/api/images', (_req: Request, res: Response) => {
  const projectsPath = path.join(__dirname, '../projects');
  const images: Array<{ name: string; url: string }> = [];

  try {
    if (fs.existsSync(projectsPath)) {
      const imagesPath = path.join(projectsPath, 'images');
      if (fs.existsSync(imagesPath)) {
        const imageFiles = fs.readdirSync(imagesPath)
          .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
          .map(file => ({
            name: file,
            url: `/projects/images/${file}`
          }));
        images.push(...imageFiles);
      }
    }
    const response: ApiResponse<Array<{ name: string; url: string }>> = { 
      data: images.sort((a, b) => a.name.localeCompare(b.name)) 
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { error: 'Failed to fetch images' };
    res.status(500).json(response);
  }
});

// Delete image route
app.delete('/api/images/:imageName', (req: Request, res: Response) => {
  const { imageName } = req.params;
  if (!imageName) {
    const response: ApiResponse = { error: 'Image name is required' };
    return res.status(400).json(response);
  }

  const imagePath = path.join(__dirname, '../projects/images', imageName);

  try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        const response: ApiResponse = { message: 'Image deleted successfully' };
        return res.json(response);
      }
    const response: ApiResponse = { error: 'Image not found' };
    res.status(404).json(response);
  } catch (error) {
    const response: ApiResponse = { error: 'Failed to delete image' };
    res.status(500).json(response);
  }
});

// Handle client-side routing - this should be the last route
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Press CTRL-C to stop');
});