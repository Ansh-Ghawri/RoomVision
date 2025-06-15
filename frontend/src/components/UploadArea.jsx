import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';


function UploadArea({ onUpload }) {
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate progressive loading for visual appeal
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  useEffect(() => {
    // Simulate loading progress when uploading
    if (isUploading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(0);
    }
  }, [isUploading]);

  const onDrop = useCallback((acceptedFiles) => {
    setIsUploading(true);
    setUploadStatus('Uploading...');
    setPreviewUrls(acceptedFiles.map(file => URL.createObjectURL(file)));
    setUploadedFiles([]);
    setSuggestions([]);

    const formData = new FormData();
    acceptedFiles.forEach((file) => formData.append('file', file));

    axios.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((response) => {
      setUploadStatus('Upload successful!');
      setUploadedFiles(response.data.urls || []);
      setSuggestions(response.data.suggestions || []);
      setIsUploading(false);
      setLoadingProgress(100);

      // Add these debug logs
      console.log('Upload response details:', {
        urls: response.data.urls,
        suggestions: response.data.suggestions
      });
      
      // Check each suggestion's structure
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        response.data.suggestions.forEach((suggestion, index) => {
          console.log(`Suggestion ${index}:`, {
            filename: suggestion.filename,
            detectedObjects: suggestion.detectedObjects,
            colorPalette: suggestion.colorPalette,
            recommendations: suggestion.recommendations,
            suggestion: suggestion.suggestion
          });
        });
      }

      console.log('Upload response:', response.data);
    })
    .catch((error) => {
      setUploadStatus('Upload failed. Please try again.');
      setIsUploading(false);
      console.error('Upload failed:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    maxSize: 5 * 1024 * 1024,
  });

  const clearUploads = () => {
    setUploadStatus('');
    setPreviewUrls([]);
    setUploadedFiles([]);
    setSuggestions([]);
  };

  return (
    <div className={`container mx-auto transition-all duration-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="text-center">
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-xl p-10 transition-all duration-500 ease-out cursor-pointer group overflow-hidden ${
            isDragActive 
              ? 'bg-indigo-50 dark:bg-gray-700 border-indigo-500 scale-105 shadow-lg' 
              : 'border-indigo-200 dark:border-indigo-400 hover:border-indigo-400 hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-md'
          }`}
        >
          {/* Animated corner decorations */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-400 -translate-x-1 -translate-y-1 transition-all duration-300 group-hover:w-8 group-hover:h-8 group-hover:border-indigo-500"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-400 translate-x-1 -translate-y-1 transition-all duration-300 group-hover:w-8 group-hover:h-8 group-hover:border-indigo-500"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-400 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:w-8 group-hover:h-8 group-hover:border-indigo-500"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-400 translate-x-1 translate-y-1 transition-all duration-300 group-hover:w-8 group-hover:h-8 group-hover:border-indigo-500"></div>
          
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="py-12">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                <svg className="animate-spin absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset={283 * (1 - loadingProgress / 100)}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-semibold">
                  {Math.round(loadingProgress)}%
                </div>
              </div>
              <p className="mt-4 text-indigo-600 font-medium animate-pulse">Analyzing your space...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait while our AI processes your images</p>
            </div>
          ) : isDragActive ? (
            <div className="py-10">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform animate-pulse shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-indigo-600 text-xl font-semibold">Release to upload!</p>
              <p className="text-indigo-400 mt-2">Let's transform your space</p>
            </div>
          ) : (
            <div className="py-10">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow group-hover:shadow-lg transition-all group-hover:scale-110 duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500 group-hover:text-indigo-600 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-800 dark:text-gray-200 text-xl font-semibold mb-2 group-hover:text-indigo-700 transition-colors">Drag & drop your room images here</p>
              <p className="text-gray-500 group-hover:text-indigo-500 transition-colors">or click to browse files (5MB max)</p>
              
              <div className="mt-6 flex items-center justify-center gap-6 text-gray-400">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span className="text-sm">JPG, PNG</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <span className="text-sm">Max 5MB</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {uploadStatus && (
          <div className={`mt-6 p-4 rounded-lg transform transition-all duration-500 ${
            uploadStatus.includes('failed') 
              ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500 shadow-md' 
              : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500 shadow-md'
          }`}>
            <p className="font-medium flex items-center justify-center">
              {uploadStatus.includes('failed') ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {uploadStatus}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {uploadStatus}
                </>
              )}
            </p>
          </div>
        )}
        
        {previewUrls.length > 0 && (
          <div className="mt-16 transition-all duration-500 ease-out transform">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 inline-block relative">
              Preview
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {previewUrls.map((url, index) => (
                <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-60 object-cover transform transition-transform group-hover:scale-105 duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/40 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <p className="font-medium text-lg">Room Image {index + 1}</p>
                    <p className="text-indigo-200 text-sm mt-1">Ready for analysis</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {uploadedFiles.length > 0 && (
          <div className="mt-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl border border-indigo-100 dark:border-indigo-400 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300 mb-6 inline-block relative">
              Uploaded Files
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></span>
            </h3>
            <ul className="space-y-3 mb-8">
              {uploadedFiles.map((url, index) => (
                <li key={index} className="flex items-center justify-center space-x-3 p-3 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-70 rounded-lg hover:bg-opacity-100 dark:hover:bg-opacity-80 transition-all duration-300 shadow-sm hover:shadow">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-600 hover:text-indigo-800 hover:underline truncate max-w-xs transition-colors font-medium flex-1"
                  >
                    {url.split('/').pop()}
                  </a>
                  <span className="text-xs text-gray-400 dark:text-gray-300 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-full">
                    Processed
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={clearUploads}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 font-medium"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Uploads
              </div>
            </button>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-16 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl border border-purple-100 dark:border-purple-400 shadow-lg transition-all duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-6 inline-block relative">
              Design Suggestions
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></span>
            </h3>
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {suggestion.filename.replace(/-room\.jpg$/, '')}
                  </h4>
                </div>
                {suggestion.error ? (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-red-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {suggestion.error}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg border border-indigo-100 dark:border-indigo-400">
                      <h5 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Detected Objects
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.detectedObjects && suggestion.detectedObjects.length > 0 ? 
                          suggestion.detectedObjects.map((obj, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-xs font-medium text-indigo-600 dark:text-indigo-300 border border-indigo-100 shadow-sm">
                              {obj.label || "Unknown"} ({obj.score ? `${(obj.score * 100).toFixed(1)}%` : "N/A%"})
                            </span>
                          )) : 
                          <span className="text-gray-500 dark:text-gray-400 text-sm">No objects detected</span>
                        }
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg border border-purple-100 dark:border-purple-400">
                      <h5 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        Color Palette
                      </h5>
                      {suggestion.colorPalette && suggestion.colorPalette.length > 0 ? (
                        <div className="flex space-x-2">
                          {suggestion.colorPalette.map((color, idx) => (
                            <div key={idx} className="color-swatch flex-1">
                              <div 
                                className="h-10 rounded-lg shadow-inner"
                                style={{ backgroundColor: color }}
                              ></div>
                              <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">{color}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No color palette available</p>
                      )}
                    </div>
                    
                    <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg border border-green-100 dark:border-green-400">
                      <h5 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Design Recommendations
                      </h5>
                      <div className="space-y-3">
                        {(() => {
                          // Handle both recommendations and single suggestion property
                          const recommendationsArray = suggestion.recommendations || 
                                                    (suggestion.suggestion ? [suggestion.suggestion] : []);
                          
                          return recommendationsArray.length > 0 ? 
                            recommendationsArray.map((rec, idx) => (
                              <div key={idx} className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                                  <span className="text-xs font-semibold text-green-700 dark:text-green-300">{idx + 1}</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
                              </div>
                            )) : 
                            <p className="text-sm text-gray-500">No recommendations available</p>
                        })()}
                      </div>
                    </div>
                    
                    <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 font-medium flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Generate Room Designs
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadArea;