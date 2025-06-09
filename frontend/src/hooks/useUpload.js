import { useState, useCallback } from 'react';
import axios from 'axios';

export const useUpload = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const uploadFiles = useCallback(async (acceptedFiles) => {
    setIsUploading(true);
    setUploadStatus('Uploading...');
    setPreviewUrls(acceptedFiles.map(file => URL.createObjectURL(file)));
    setUploadedFiles([]);
    setSuggestions([]);

    const formData = new FormData();
    acceptedFiles.forEach((file) => formData.append('file', file));

    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadStatus('Upload successful!');
      setUploadedFiles(response.data.urls || []);
      setSuggestions(response.data.suggestions || []);
      setLoadingProgress(100);

      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      setUploadStatus('Upload failed. Please try again.');
      console.error('Upload failed:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const clearUploads = useCallback(() => {
    setUploadStatus('');
    setPreviewUrls([]);
    setUploadedFiles([]);
    setSuggestions([]);
    setLoadingProgress(0);
  }, []);

  const updateLoadingProgress = useCallback((progress) => {
    setLoadingProgress(progress);
  }, []);

  return {
    uploadStatus,
    previewUrls,
    uploadedFiles,
    suggestions,
    isUploading,
    loadingProgress,
    uploadFiles,
    clearUploads,
    updateLoadingProgress
  };
}; 