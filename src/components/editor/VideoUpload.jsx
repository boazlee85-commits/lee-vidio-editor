import React, { useRef, useState } from 'react';
import { Upload, File, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

export function VideoUpload({ onVideoSelected, maxSize = 500 }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);

  const ACCEPTED_FORMATS = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  const MAX_FILE_SIZE = maxSize * 1024 * 1024; // Convert MB to bytes

  const handleFile = (file) => {
    setError(null);

    if (!ACCEPTED_FORMATS.includes(file.type)) {
      setError('Please upload a valid video file (MP4, WebM, OGG, or MOV)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setFileName(file.name);
    const url = URL.createObjectURL(file);
    onVideoSelected(url, file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {fileName ? `Selected: ${fileName}` : 'Upload your video'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: MP4, WebM, OGG, MOV • Max size: {maxSize}MB
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {fileName && !error && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <File className="h-4 w-4 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900">{fileName}</p>
            <p className="text-xs text-green-700">Ready to edit</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFileName(null);
              inputRef.current.value = '';
            }}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
