
import React, { useRef } from 'react';
import { ImageIcon } from './icons/ImageIcon';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imageSrc: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imageSrc }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div 
        className={`flex-1 w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200 ${imageSrc ? 'p-0' : 'p-6'}`}
        onClick={handleDropzoneClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {imageSrc ? (
          <img src={imageSrc} alt="Uploaded room" className="w-full h-full object-contain rounded-md" />
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-600">
              Click to upload a photo
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, or WEBP
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
