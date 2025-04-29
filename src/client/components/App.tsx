import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { cn } from '../utils/cn';
import { NavBar } from './NavBar';
import FileBrowser from './FileBrowser';

interface Project {
  name: string;
  files: string[];
}
export const App: React.FC = () => {
  // State definitions with proper types
  const [markdown, setMarkdown] = useState<string>('# Welcome\nStart typing your markdown here...');
  const [projectName, setProjectName] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [projects, setProjects] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Preview iframe effect
  useEffect(() => {
    const iframe = document.getElementById('preview') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      const content = marked(markdown);
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(content);
      iframe.contentWindow.document.close();
    }
  }, [markdown]);

  // Fetch projects function
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      setMessage('Error fetching projects');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="container mx-auto p-4 mt-6">
        <div className="flex gap-4 mb-4">
          <input
            list="projects"
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="File name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="border p-2 rounded-lg"
          />
          <datalist id="projects">
            {projects.map((project: string) => (
              <option key={project} value={project} />
            ))}
          </datalist>
        </div>
        
        {message && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="border p-2 h-[500px] rounded-lg"
          />
          <iframe
            id="preview"
            title="Preview"
            className="border h-[500px] rounded-lg"
          />
        </div>
      </main>
    </div>
  );
};
