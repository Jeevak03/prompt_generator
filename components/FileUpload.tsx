import React, { useState, useCallback } from 'react';
import { MAX_FILES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, ALLOWED_MIME_TYPES, BLOCKED_FILE_EXTENSIONS } from '../constants';
import { UploadCloudIcon, FileIcon, XIcon } from './icons/Icons';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      validateAndSetFiles(newFiles);
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const newFiles = Array.from(event.dataTransfer.files);
    validateAndSetFiles(newFiles);
  }, []);

  const validateAndSetFiles = (files: File[]) => {
    setError(null);
    let validationError = '';

    if (files.length > MAX_FILES) {
      validationError = `You can only upload a maximum of ${MAX_FILES} files.`;
    } else {
        for (const file of files) {
            const fileExtension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
            if (BLOCKED_FILE_EXTENSIONS.includes(fileExtension)) {
                validationError = `File type "${fileExtension}" is not allowed for security reasons.`;
                break;
            }
            if (!ALLOWED_MIME_TYPES.includes(file.type)) {
                validationError = `File type for "${file.name}" is not supported. Please upload one of the supported formats.`;
                break;
            }
            if (file.size > MAX_FILE_SIZE_BYTES) {
                validationError = `File "${file.name}" exceeds the ${MAX_FILE_SIZE_MB.toFixed(1)}MB size limit.`;
                break;
            }
        }
    }

    if (validationError) {
      setError(validationError);
      setSelectedFiles([]);
      onFilesChange([]);
    } else {
      setSelectedFiles(files);
      onFilesChange(files);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);
     if (error) setError(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  return (
    <div>
      <div 
        className="flex justify-center items-center w-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700/50 hover:bg-slate-700/80 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloudIcon className="w-10 h-10 mb-4 text-slate-400" />
            <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-slate-500">Supported: PDF, DOCX, PPTX, TXT, MD, CSV</p>
          </div>
          <input 
            id="dropzone-file" 
            type="file" 
            className="hidden" 
            multiple 
            onChange={handleFileChange} 
            accept={ALLOWED_MIME_TYPES.join(',')}
          />
        </label>
      </div>

      {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}

      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg text-slate-300 mb-2">Selected Files:</h3>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-slate-700/70 rounded-md">
                <div className="flex items-center space-x-3">
                  <FileIcon className="w-5 h-5 text-sky-400" />
                  <span className="text-sm font-medium text-slate-200">{file.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button onClick={() => removeFile(index)} className="text-slate-500 hover:text-red-400">
                      <XIcon className="w-5 h-5" />
                    </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
