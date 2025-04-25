import React, { useState, useEffect } from 'react';

const JsEditor: React.FC = () => {
  const [js, setJs] = useState('');
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
    }
  };

  const saveScript = async () => {
    if (!projectName || !fileName) {
      setMessage('Project name and file name are required');
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectName}/js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, content: js }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('JavaScript file saved successfully');
      } else {
        setMessage(data.error || 'Failed to save JavaScript file');
      }
    } catch (error) {
      console.error('Error saving JavaScript file:', error);
      setMessage('Failed to save JavaScript file');
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
              .js
            </span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="jsEditor" className="block text-sm font-medium mb-1">
          JavaScript
        </label>
        <textarea
          id="jsEditor"
          className="w-full h-[600px] bg-gray-800 text-white p-4 font-mono text-sm resize-none rounded border border-gray-700"
          value={js}
          onChange={(e) => setJs(e.target.value)}
          placeholder="Enter your JavaScript here..."
          spellCheck="false"
        />
      </div>

      <button
        onClick={saveScript}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Script
      </button>
    </div>
  );
};

export default JsEditor;