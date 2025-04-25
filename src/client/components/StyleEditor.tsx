import React, { useState, useEffect } from 'react';

const StyleEditor: React.FC = () => {
  const [css, setCss] = useState('');
  const [projectName, setProjectName] = useState('');
  const [fileName, setFileName] = useState('');
  const [projects, setProjects] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  // Add similar project fetching logic as in App.tsx
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
    }
  };

  const saveStyle = async () => {
    if (!projectName || !fileName) {
      setMessage('Project name and file name are required');
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectName}/styles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, content: css }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Style file saved successfully');
      } else {
        setMessage(data.error || 'Failed to save style file');
      }
    } catch (error) {
      console.error('Error saving style file:', error);
      setMessage('Failed to save style file');
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
          <input
            id="projectName"
            type="text"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            list="projects"
          />
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
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l text-white"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <span className="px-3 py-2 bg-gray-700 border border-gray-700 rounded-r text-gray-400">
              .css
            </span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="cssEditor" className="block text-sm font-medium mb-1">
          CSS
        </label>
        <textarea
          id="cssEditor"
          className="w-full h-[600px] bg-gray-800 text-white p-4 font-mono text-sm resize-none rounded border border-gray-700"
          value={css}
          onChange={(e) => setCss(e.target.value)}
          placeholder="Enter your CSS here..."
          spellCheck="false"
        />
      </div>

      <button
        onClick={saveStyle}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Style
      </button>
    </div>
  );
};

export default StyleEditor;