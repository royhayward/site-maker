import React, { useState, useEffect } from 'react';

const ImageRepo: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!projectName) {
      setMessage('Please select a project first');
      return;
    }

    const files = event.target.files;
    if (!files) return;

    const formData = new FormData();
    formData.append('image', files[0]);

    try {
      const response = await fetch(`/api/projects/${projectName}/images`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Image uploaded successfully');
        // Refresh image list
        fetchProjectImages();
      } else {
        setMessage(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Failed to upload image');
    }
  };

  const fetchProjectImages = async () => {
    if (!projectName) return;

    try {
      const response = await fetch(`/api/projects/${projectName}/images`);
      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    if (projectName) {
      fetchProjectImages();
    }
  }, [projectName]);

  return (
    <div className="space-y-4">
      {message && (
        <div className="p-3 bg-gray-800 rounded">
          {message}
        </div>
      )}

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
        <label className="block text-sm font-medium mb-1">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Project Images</h3>
        <div className="grid grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image} className="bg-gray-800 p-2 rounded">
              <img
                src={`/projects/${projectName}/images/${image}`}
                alt={image}
                className="w-full h-40 object-cover rounded"
              />
              <p className="mt-1 text-sm text-gray-400 truncate">{image}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageRepo;