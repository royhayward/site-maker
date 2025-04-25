import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { cn } from '../utils/cn';
import FileBrowser from './FileBrowser';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState('# Welcome\nStart typing your markdown here...');
  const [projectName, setProjectName] = useState('');
  const [fileName, setFileName] = useState('');
  const [projects, setProjects] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setMessage('Failed to fetch projects');
    }
  };

  const createProject = async () => {
    if (!projectName) {
      setMessage('Project name is required');
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Project created successfully');
        fetchProjects();
      } else {
        setMessage(data.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setMessage('Failed to create project');
    }
  };

  const saveFile = async () => {
    if (!projectName || !fileName) {
      setMessage('Project name and file name are required');
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectName}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, content: markdown }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('File saved successfully');
      } else {
        setMessage(data.error || 'Failed to save file');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      setMessage('Failed to save file');
    }
  };

  const loadFile = async (fileName: string) => {
    if (!projectName) return;

    try {
      const response = await fetch(`/api/projects/${projectName}/content/${fileName}`);
      const data = await response.json();
      
      if (response.ok) {
        setMarkdown(data.content);
        setFileName(fileName);
      } else {
        setMessage(data.error || 'Failed to load file');
      }
    } catch (error) {
      console.error('Error loading file:', error);
      setMessage('Failed to load file');
    }
  };

  const deleteFile = async () => {
    if (!projectName || !fileName) {
      setMessage('No file selected');
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectName}/content/${fileName}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('File deleted successfully');
        setFileName('');
        setMarkdown('# Welcome\nStart typing your markdown here...');
      } else {
        setMessage(data.error || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setMessage('Failed to delete file');
    }
};

  const generatePreviewContent = () => {
    const htmlContent = marked(markdown);
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              padding: 2rem;
              max-width: 800px;
              margin: 0 auto;
    }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1.5em;
              margin-bottom: 0.5em;
            }
            p {
              margin: 1em 0;
            }
            code {
              background: #f0f0f0;
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-family: monospace;
            }
            pre code {
              display: block;
              padding: 1em;
              overflow-x: auto;
            }
            blockquote {
              border-left: 4px solid #ddd;
              padding-left: 1em;
              margin-left: 0;
              color: #666;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1em 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
};

  useEffect(() => {
    const iframe = document.getElementById('preview') as HTMLIFrameElement;
    if (iframe) {
      iframe.srcdoc = generatePreviewContent();
    }
  }, [markdown]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Markdown Editor</h1>
      </header>

      {message && (
        <div className="mb-4 p-3 bg-gray-800 rounded">
          {message}
        </div>
      )}

      {projectName && (
        <FileBrowser
          projectName={projectName}
          onFileSelect={loadFile}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="editor-section">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium mb-1">
                  Project Name
                </label>
                <div className="flex">
                  <input
                    id="projectName"
                    type="text"
                    className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-l text-white focus:outline-none focus:border-blue-500"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    list="projects"
                  />
                  <button
                    onClick={createProject}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Create
                  </button>
                </div>
                <datalist id="projects">
                  {projects.map(project => (
                    <option key={project} value={project} />
                  ))}
                </datalist>
              </div>
              <div>
                <label htmlFor="fileName" className="block text-sm font-medium mb-1">
                  File Name
                </label>
                <div className="flex">
                  <input
                    id="fileName"
                    type="text"
                    className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-l text-white focus:outline-none focus:border-blue-500"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter file name"
                  />
                  <span className="px-3 py-2 bg-gray-700 border border-l-0 border-gray-700 rounded-r text-gray-400">
                    .md
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4 flex gap-2">
              <button
                onClick={saveFile}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Save File
              </button>
              {fileName && (
                <button
                  onClick={deleteFile}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Delete File
                </button>
              )}
            </div>

            <div>
              <label htmlFor="markdownEditor" className="block text-sm font-medium mb-1">
                Markdown
              </label>
              <textarea
                id="markdownEditor"
                className="w-full h-[500px] bg-gray-900 text-white p-4 font-mono text-sm resize-none rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Enter your markdown here..."
                spellCheck="false"
              />
            </div>
          </div>
        </div>

        <div className="preview-section">
          <div className="bg-gray-800 rounded-lg p-4 h-[660px]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Preview</h2>
              <div className="text-sm text-gray-400">
                {projectName && fileName && `${projectName}/${fileName}.md`}
              </div>
            </div>
            <iframe
              id="preview"
              className="w-full h-[600px] bg-white rounded"
              sandbox="allow-scripts"
              title="Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;