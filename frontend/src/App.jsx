import { useState, useEffect } from 'react';
import './index.css';
import UploadArea from './components/UploadArea';
import DesignSuggestions from './components/DesignSuggestions';
import UserProfile from './components/UserProfile';



function App() {
  const [designSuggestions, setDesignSuggestions] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Add entrance animation when component mounts
    setTimeout(() => setAppLoaded(true), 100);
  }, []);

  const handleUpload = async (uploadedFiles) => {
    setUploading(true);
    
    const formData = new FormData();
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append('file', uploadedFiles[i]);
    }
    
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setDesignSuggestions(data.suggestions);
      setShowUploadForm(false); // Hide upload form after successful upload
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleNewUpload = () => {
    setShowUploadForm(true);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 transition-all duration-1000 ease-out ${appLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Enhanced animated background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute left-1/4 top-1/3 w-64 h-64 rounded-full bg-blue-400 mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute right-1/4 top-1/2 w-72 h-72 rounded-full bg-purple-400 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/3 bottom-1/4 w-80 h-80 rounded-full bg-indigo-400 mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        <div className="absolute right-1/3 top-1/4 w-56 h-56 rounded-full bg-pink-400 mix-blend-multiply filter blur-xl animate-blob animation-delay-3000"></div>
        <div className="absolute left-1/2 bottom-1/3 w-60 h-60 rounded-full bg-cyan-400 mix-blend-multiply filter blur-xl animate-blob animation-delay-5000"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border-2 border-indigo-200 rounded-full opacity-20 animate-spin-slow"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-purple-200 rounded-full opacity-20 animate-spin-slow-reverse"></div>
      
      <div className={`text-center w-full max-w-5xl px-4 relative z-10 transition-all duration-1000 ease-out transform ${appLoaded ? 'translate-y-0' : 'translate-y-8'}`}>
        <div className="flex justify-end mb-4">
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-md font-semibold hover:bg-purple-600 transition-colors"
            onClick={() => setShowProfile((prev) => !prev)}
          >
            {showProfile ? 'Back to App' : 'Edit Style Profile'}
          </button>
        </div>
        {showProfile ? (
          <UserProfile />
        ) : (
          <>
            <div className="mb-10">
              <div className="flex justify-center items-center mb-4">
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-2"></div>
                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 leading-relaxed py-1">
                  RoomVision
                </h1>
                <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full ml-2"></div>
              </div>
              <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
                Upload images of your space and get <span className="text-indigo-600 font-semibold">professional design</span> recommendations instantly
              </p>
            </div>
            
            <div className="bg-white backdrop-filter backdrop-blur-lg bg-opacity-80 rounded-3xl shadow-xl p-8 border border-white transition-all duration-500 hover:shadow-2xl">
              <div className="relative">
                {/* Decorative corner accents */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-indigo-400 rounded-br-lg"></div>
                
                {showUploadForm ? (
                  <UploadArea onUpload={handleUpload} uploading={uploading} />
                ) : (
                  <DesignSuggestions 
                    suggestions={designSuggestions} 
                    onNewUpload={handleNewUpload} 
                  />
                )}
              </div>
            </div>
            
            <div className="mt-8 flex flex-col items-center">
              <div className="text-sm text-gray-500 mb-2 flex items-center">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mr-3"></div>
                Powered by advanced AI to transform your living spaces
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent ml-3"></div>
              </div>
              <div className="flex space-x-4 mt-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;