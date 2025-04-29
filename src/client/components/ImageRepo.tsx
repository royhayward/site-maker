import React, { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface ImageFile {
  name: string;
  url: string;
}
export const ImageRepo: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images');
      const data = await response.json();
      // Sort images alphabetically by name
      const sortedImages = data.sort((a: ImageFile, b: ImageFile) => 
        a.name.localeCompare(b.name)
      );
      setImages(sortedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('image') as File;

    if (!file) {
      setUploadStatus('Please select a file');
      return;
    }

    // Validate file type
    const fileType = file.type.toLowerCase();
    if (!['image/jpeg', 'image/png'].includes(fileType)) {
      setUploadStatus('Only JPG and PNG files are allowed');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading...');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      setUploadStatus('Upload successful!');
      // Reset form
      event.currentTarget.reset();
      // Refresh image list
      await fetchImages();
    } catch (error) {
      setUploadStatus('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageName: string) => {
    try {
      const response = await fetch(`/api/images/${encodeURIComponent(imageName)}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      // Remove image from state
      setImages(images.filter(img => img.name !== imageName));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Upload Form */}
      <form onSubmit={handleUpload} className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-800">Upload Image</h2>
          
          <div className="flex gap-4 items-center">
            <input
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png"
              className={cn(
                "flex-1 px-4 py-2 border rounded-lg",
                "file:mr-4 file:py-2 file:px-4 file:rounded-lg",
                "file:border-0 file:text-sm file:font-semibold",
                "file:bg-slate-50 file:text-slate-700",
                "hover:file:bg-slate-100"
              )}
            />
            <button
              type="submit"
              disabled={isUploading}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                "bg-blue-500 text-white hover:bg-blue-600",
                "disabled:bg-blue-300 disabled:cursor-not-allowed",
                "hover:scale-105 active:scale-95"
              )}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          
          {uploadStatus && (
            <p className={cn(
              "text-sm",
              uploadStatus.includes('successful') ? 'text-green-600' : 'text-red-600'
            )}>
              {uploadStatus}
            </p>
          )}
        </div>
      </form>

      {/* Image List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Project Images</h2>
        
        {images.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No images uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {images.map((image) => (
              <div
                key={image.name}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                {/* File Name */}
                <span className="flex-1 font-medium text-slate-700">
                  {image.name}
                </span>
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(image.name)}
                  className={cn(
                    "px-3 py-1 rounded-lg font-medium text-sm",
                    "text-red-600 hover:bg-red-50",
                    "transition-all duration-200",
                    "hover:scale-105 active:scale-95"
                  )}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
