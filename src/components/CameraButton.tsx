'use client';

import Link from 'next/link';
import {Camera} from 'lucide-react';

const CameraButton = () => {
  return (
    <Link
      href="/create-recipe"
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-lg"
    >
      <div className="flex items-center">
        <Camera className="mr-2" size={20} />
        <span>Upload Photo</span>
      </div>
    </Link>
  );
};

export default CameraButton;
