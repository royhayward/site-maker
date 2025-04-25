import React from 'react';

interface FileBrowserProps {
  projectName: string;
  onFileSelect: (fileName: string) => void;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ projectName, onFileSelect }) => {
  const [files, setFiles] = React.useState<string[]>([]);

  const fetchProjectFiles = async () => {
    try {
      const response = await fetch(`/api/projects/${projectName}/files`);
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  React.useEffect(() => {
    if (projectName) {
      fetchProjectFiles();
    }
  }, [projectName]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium mb-2">Project Files</h3>
      <div className="max-h-60 overflow-y-auto">
        {files.map((file) => (
          <button
            key={file}
            onClick={() => onFileSelect(file)}
            className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-sm"
          >
            {file}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FileBrowser;