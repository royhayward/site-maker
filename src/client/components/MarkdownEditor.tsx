import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import MarkdownReference from './MarkdownReference';

interface MarkdownEditorProps {}

const MarkdownEditor: React.FC<MarkdownEditorProps> = () => {
  const [markdown, setMarkdown] = useState('# Welcome\nStart typing your markdown here...');
  const [projectName, setProjectName] = useState('');
  const [fileName, setFileName] = useState('');
  const [projects, setProjects] = useState<string[]>([]);
  const [projectFiles, setProjectFiles] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isNewProject, setIsNewProject] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectName) {
      fetchProjectFiles();
    } else {
      setProjectFiles([]);
    }
  }, [projectName]);

  useEffect(() => {
    const htmlContent = marked(markdown);
    setPreviewContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
  }, [markdown]);

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

  const fetchProjectFiles = async () => {
    try {
      const response = await fetch(`/api/projects/${projectName}/content`);
      const data = await response.json();
      setProjectFiles(data.files);
    } catch (error) {
      console.error('Error fetching project files:', error);
      setMessage('Failed to fetch project files');
    }
  };

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProjectName = e.target.value;
    setProjectName(newProjectName);
    setIsNewProject(!projects.includes(newProjectName));
    if (!newProjectName) {
      setFileName('');
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
        setIsNewProject(false);
      } else {
        setMessage(data.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setMessage('Failed to create project');
    }
  };

  const loadFile = async (selectedFileName: string) => {
    try {
      const response = await fetch(`/api/projects/${projectName}/content/${selectedFileName}`);
      const data = await response.json();
      if (response.ok) {
        setMarkdown(data.content);
        setFileName(selectedFileName.replace('.md', ''));
      } else {
        setMessage(data.error || 'Failed to load file');
      }
    } catch (error) {
      console.error('Error loading file:', error);
      setMessage('Failed to load file');
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
        fetchProjectFiles();
      } else {
        setMessage(data.error || 'Failed to save file');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      setMessage('Failed to save file');
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className="p-3 bg-gray-800 rounded">
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium mb-1">
            Project Name
          </label>
          <div className="flex gap-2">
            <input
              id="projectName"
              type="text"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              value={projectName}
              onChange={handleProjectNameChange}
              placeholder="Select or enter new project name"
              list="projects"
            />
            <button
              onClick={createProject}
              disabled={!isNewProject || !projectName}
              className={`px-4 py-2 rounded text-white ${
                !isNewProject || !projectName
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Create
            </button>
            <datalist id="projects">
              {projects.map(project => (
                <option key={project} value={project} />
              ))}
            </datalist>
          </div>
        </div>

        <div>
          <label htmlFor="fileName" className="block text-sm font-medium mb-1">
            File Name
          </label>
          <div className="flex gap-2">
            <div className="flex flex-1">
              <input
                id="fileName"
                type="text"
                className={`flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l text-white ${
                  !projectName ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder={projectName ? "Enter file name" : "Select a project first"}
                disabled={!projectName}
              />
              <span className={`px-3 py-2 bg-gray-700 border border-gray-700 text-gray-400 ${
                !projectName ? 'opacity-50' : ''
              }`}>
                .md
              </span>
            </div>
            <button
              onClick={saveFile}
              disabled={!fileName}
              className={`px-4 py-2 rounded text-white ${
                !fileName
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Save
            </button>
            <button
              onClick={() => setIsReferenceOpen(true)}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Markdown
            </button>
          </div>
        </div>
      </div>

      {projectName && projectFiles.length > 0 && (
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-sm font-medium mb-2">Project Files:</h3>
          <div className="flex flex-wrap gap-2">
            {projectFiles.map(file => (
              <button
                key={file}
                onClick={() => loadFile(file)}
                className={`px-3 py-1 text-sm rounded ${
                  file.replace('.md', '') === fileName
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {file.replace('.md', '')}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label htmlFor="markdownEditor" className="block text-sm font-medium mb-1">
            Markdown
          </label>
          <textarea
            id="markdownEditor"
            className={`w-full h-[600px] bg-gray-800 text-white p-4 font-mono text-sm resize-none rounded border border-gray-700 ${
              !fileName ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder={fileName ? "Enter your markdown here..." : "Enter a file name first"}
            spellCheck="false"
            disabled={!fileName}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Preview
          </label>
          <iframe
            srcDoc={previewContent}
            className={`w-full h-[600px] bg-white rounded border border-gray-700 ${
              !fileName ? 'opacity-50' : ''
            }`}
            sandbox="allow-scripts"
            title="Preview"
          />
        </div>
      </div>

      <MarkdownReference 
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />
    </div>
  );
};

export default MarkdownEditor;
