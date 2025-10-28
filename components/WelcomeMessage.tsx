
import React from 'react';
import { ImageIcon } from './icons/ImageIcon';

export const WelcomeMessage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="bg-indigo-100 p-4 rounded-full">
                <ImageIcon className="h-10 w-10 text-indigo-500" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-700">Ready to organize?</h3>
            <p className="mt-1 max-w-md">
                Upload a photo of any room, and our AI assistant will provide personalized decluttering tips and organization ideas.
            </p>
        </div>
    );
};
