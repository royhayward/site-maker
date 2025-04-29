import React from 'react';

export interface NavBarProps {
  selectedProject: string;
  onProjectSelect: (projectName: string) => void;
  onFileSelect: (fileName: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({
  selectedProject,
  onProjectSelect,
  onFileSelect
}) => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-screen-2xl mx-auto px-4">
        {/* Brand and Logo */}
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="text-lg font-semibold">SiteMaker</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex -mb-px">
          <button
            onClick={() => onProjectSelect('editor')}
            className={`
              relative px-6 py-3 text-sm font-medium
              border-b-2 transition-all duration-200
              ${selectedProject === 'editor' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}
              before:content-['']
              before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5
              ${selectedProject === 'editor' ? 'before:bg-primary' : 'before:bg-transparent hover:before:bg-muted'}
            `}
          >
            Editor
            </button>
          
          <button
            onClick={() => onProjectSelect('images')}
            className={`
              relative px-6 py-3 text-sm font-medium
              border-b-2 transition-all duration-200
              ${selectedProject === 'images' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}
              before:content-['']
              before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5
              ${selectedProject === 'images' ? 'before:bg-primary' : 'before:bg-transparent hover:before:bg-muted'}
            `}
              >
            Images
            </button>
          
          <button
            onClick={() => onProjectSelect('settings')}
            className={`
              relative px-6 py-3 text-sm font-medium
              border-b-2 transition-all duration-200
              ${selectedProject === 'settings' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}
              before:content-['']
              before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5
              ${selectedProject === 'settings' ? 'before:bg-primary' : 'before:bg-transparent hover:before:bg-muted'}
            `}
          >
            Settings
          </button>
      </div>
      </div>
    </nav>
  );
};

export default NavBar;
