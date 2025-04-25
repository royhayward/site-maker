    console.log('Server starting...');

import express from 'express';
import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config';

const app = express();
const compiler = webpack(webpackConfig as webpack.Configuration);

// Middleware
app.use(express.json());

// Development middleware
if (process.env.NODE_ENV === 'development') {
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: '/',
    })
  );
}

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API endpoints
app.get('/api/projects', (req, res) => {
  const projectsPath = path.join(__dirname, '../projects');
  
  try {
    if (!fs.existsSync(projectsPath)) {
      fs.mkdirSync(projectsPath);
    }
    
    const projects = fs.readdirSync(projectsPath)
      .filter(file => fs.statSync(path.join(projectsPath, file)).isDirectory());
    
    res.json({ projects });
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

app.post('/api/projects', (req, res) => {
  const { projectName } = req.body;
  
  if (!projectName) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const projectPath = path.join(__dirname, '../projects', projectName);
  
  try {
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
      // Create subdirectories
      fs.mkdirSync(path.join(projectPath, 'images'));
      fs.mkdirSync(path.join(projectPath, 'styles'));
      fs.mkdirSync(path.join(projectPath, 'js'));
      fs.mkdirSync(path.join(projectPath, 'content'));
    }
    
    res.json({ message: 'Project created successfully', projectName });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.get('/api/projects/:projectName/content', (req, res) => {
  const { projectName } = req.params;
  const contentPath = path.join(__dirname, '../projects', projectName, 'content');
  
  try {
    if (!fs.existsSync(contentPath)) {
      fs.mkdirSync(contentPath, { recursive: true });
      return res.json({ files: [] });
    }
    
    const files = fs.readdirSync(contentPath)
      .filter(file => file.endsWith('.md'));
    
    res.json({ files });
  } catch (error) {
    console.error('Error reading content files:', error);
    res.status(500).json({ error: 'Failed to read content files' });
  }
});

app.get('/api/projects/:projectName/content/:fileName', (req, res) => {
  const { projectName, fileName } = req.params;
  const filePath = path.join(__dirname, '../projects', projectName, 'content', 
    fileName.endsWith('.md') ? fileName : `${fileName}.md`
  );
  
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

app.post('/api/projects/:projectName/content', (req, res) => {
  const { projectName } = req.params;
  const { fileName, content } = req.body;
  
  if (!fileName || content === undefined) {
    return res.status(400).json({ error: 'File name and content are required' });
  }

  const contentPath = path.join(__dirname, '../projects', projectName, 'content');
  const filePath = path.join(contentPath, `${fileName}.md`);
  
  try {
    if (!fs.existsSync(contentPath)) {
      fs.mkdirSync(contentPath, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    res.json({ message: 'File saved successfully', fileName });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
      console.log('Press CTRL-C to stop');
    });
