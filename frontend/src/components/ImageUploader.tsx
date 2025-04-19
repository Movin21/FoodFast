import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { storage } from "../firebase/config";

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImage || null
  );

  // Update the compressImage function to produce much smaller files
  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");

          // Reduce maximum size to 500px (down from 800px)
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 500; // REDUCED FROM 800

          if (width > height && width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Reduce quality to 0.4 (40%) from 0.7 (70%)
          let compressedDataUrl = canvas.toDataURL("image/jpeg", 0.4);

          // Check if the base64 string is still too large (>1MB)
          // If so, compress further
          if (compressedDataUrl.length > 1000000) {
            // Try even lower quality for large images
            compressedDataUrl = canvas.toDataURL("image/jpeg", 0.2);
          }

          resolve(compressedDataUrl);
        };

        img.onerror = (error) => {
          reject(error);
        };
      };

      reader.onerror = (error) => reject(error);
    });
  };

  // Modify your uploadImage function to bypass Firebase and use base64 directly
  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Step 1: Compress locally
      setUploadProgress(50);
      const compressedImage = await compressImage(file);

      // Skip Firebase upload - directly use the base64 string
      setPreviewUrl(compressedImage);
      setUploadProgress(100);

      // Send the base64 data to parent component
      onImageUpload(compressedImage);

      setTimeout(() => {
        setUploading(false);
      }, 500);
    } catch (error: any) {
      console.error("Image processing error:", error);
      setUploadError("Failed to process image: " + error.message);
      setUploading(false);
    }
  };

  // Comment out or remove the Firebase upload function temporarily
  // const uploadToFirebase = async (base64Image: string): Promise<string> => { ... }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        uploadImage(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  });

  const removeImage = () => {
    setPreviewUrl(null);
    onImageUpload("");
  };

  return (
    <div className="space-y-4">
      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            isDragActive
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-1 text-sm text-gray-600">
            Drag and drop an image here, or click to select
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, JPEG up to 10MB (will be compressed)
          </p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Menu item preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 focus:outline-none"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {uploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {uploadProgress < 100
              ? `Processing: ${Math.round(uploadProgress)}%`
              : "Complete!"}
          </p>
        </div>
      )}

      {uploadError && (
        <div className="mt-2 text-sm text-red-600">{uploadError}</div>
      )}
    </div>
  );
};

export default ImageUploader;
