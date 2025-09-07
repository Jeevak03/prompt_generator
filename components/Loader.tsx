import React from 'react';

interface LoaderProps {
    message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center my-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-400"></div>
      <p className="mt-4 text-slate-400">{message || 'Analyzing documents and generating tasks...'}</p>
    </div>
  );
};

export default Loader;
