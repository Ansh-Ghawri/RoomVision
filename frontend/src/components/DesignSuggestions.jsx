import React, { useState } from 'react';
import { Clipboard, Copy, Check, Camera, Palette, ChevronRight, ChevronDown, ThumbsUp, RefreshCw } from 'lucide-react';

const DesignSuggestions = ({ suggestions, onNewUpload }) => {
    const [expandedFile, setExpandedFile] = useState(null);
    const [copiedColor, setCopiedColor] = useState(null);
    const [showAllObjects, setShowAllObjects] = useState(false);

    if (!suggestions || suggestions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <Camera size={48} className="text-purple-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Design Suggestions Yet</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6 text-center">Upload an image of your room to get personalized design recommendations</p>
                <button
                    onClick={onNewUpload}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
                >
                    <Camera size={18} className="mr-2" />
                    Upload Image
                </button>
            </div>
        );
    }

    const handleCopyColor = (color) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const toggleExpand = (filename) => {
        setExpandedFile(expandedFile === filename ? null : filename);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-800 border-b-2 border-purple-300 dark:border-purple-500 pb-2">
                    Design Suggestions
                </h2>
                <button
                    onClick={onNewUpload}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
                >
                    <RefreshCw size={16} className="mr-2" />
                    New Upload
                </button>
            </div>

            {suggestions.map((item) => (
                <div key={item.filename} className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div
                        className="px-6 py-4 cursor-pointer bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 flex justify-between items-center"
                        onClick={() => toggleExpand(item.filename)}
                    >
                        <div className="flex items-center">
                            {expandedFile === item.filename ?
                                <ChevronDown className="text-purple-600 mr-2" /> :
                                <ChevronRight className="text-purple-600 mr-2" />
                            }
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                {item.filename.replace(/-room\.jpg$/, '')}
                            </h3>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            {item.detectedObjects &&
                                `${item.detectedObjects.length} objects detected`}
                        </div>
                    </div>

                    {expandedFile === item.filename && (
                        <div className="px-6 py-4">
                            {/* Image and Colors */}
                            {item.dominantColors && (
                                <div className="flex flex-col md:flex-row mb-6 gap-4">
                                    <div className="w-full md:w-1/2 flex flex-col">
                                        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                            <Palette size={18} className="mr-2 text-purple-500" />
                                            Color Analysis
                                        </h4>

                                        <div className="flex flex-col gap-4">
                                            {/* Dominant Color */}
                                            <div>
                                                <div className="flex items-center mb-2">
                                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Dominant Color</div>
                                                    <div
                                                        className="ml-auto cursor-pointer"
                                                        onClick={() => handleCopyColor(item.dominantColors.dominant)}
                                                    >
                                                        {copiedColor === item.dominantColors.dominant ?
                                                            <Check size={16} className="text-green-500" /> :
                                                            <Copy size={16} className="text-gray-400 hover:text-gray-600" />
                                                        }
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-12 h-6 rounded"
                                                        style={{ backgroundColor: item.dominantColors.dominant }}
                                                    ></div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.dominantColors.dominant}</span>
                                                </div>
                                            </div>

                                            {/* Color Palette */}
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color Palette</div>
                                                <div className="flex gap-2 flex-wrap">
                                                    {item.dominantColors.palette.map((color, idx) => (
                                                        <div key={idx} className="flex flex-col items-center relative group">
                                                            <div
                                                                className="w-8 h-8 rounded-full cursor-pointer"
                                                                style={{ backgroundColor: color }}
                                                                onClick={() => handleCopyColor(color)}
                                                            ></div>
                                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity">
                                                                {color}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Complementary Colors */}
                                            {item.colorPalette && item.colorPalette.length > 1 && (
                                                <div>
                                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Complementary</div>
                                                    <div className="flex items-center gap-2">
                                                    <div 
                                                        className="w-8 h-8 rounded-full cursor-pointer" 
                                                        style={{ backgroundColor: item.colorPalette[1] }} // Complementary color is at index 1
                                                        onClick={() => handleCopyColor(item.colorPalette[1])}
                                                    ></div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.colorPalette[1]}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/2">
                                        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">Detected Objects</h4>
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-64 overflow-y-auto">
                                            {item.detectedObjects && (
                                                <>
                                                    <div className="mb-2 flex justify-between">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {showAllObjects ? 'All objects' : 'High confidence objects'}
                                                        </span>
                                                        <button
                                                            className="text-xs text-purple-600 hover:text-purple-800"
                                                            onClick={() => setShowAllObjects(!showAllObjects)}
                                                        >
                                                            {showAllObjects ? 'Show fewer' : 'Show all'}
                                                        </button>
                                                    </div>
                                                    <ul className="space-y-2">
                                                        {item.detectedObjects
                                                            .filter(obj => showAllObjects || obj.score > 0.8)
                                                            .sort((a, b) => b.score - a.score)
                                                            .map((obj, idx) => (
                                                                <li key={idx} className="flex items-center justify-between">
                                                                    <span className="text-sm font-medium">{obj.label}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="bg-gray-200 dark:bg-gray-600 h-2 w-24 rounded-full overflow-hidden">
                                                                            <div
                                                                                className="h-full bg-purple-500"
                                                                                style={{ width: `${obj.score * 100}%` }}
                                                                            ></div>
                                                                        </div>
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(obj.score * 100)}%</span>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </>
                                            )}
                                            {(!item.detectedObjects || item.detectedObjects.length === 0) && (
                                                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No objects detected</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            <div>
                                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                    <ThumbsUp size={18} className="mr-2 text-purple-500" />
                                    Design Recommendations
                                </h4>
                                <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-lg">
                                        <p className="text-gray-800 dark:text-gray-200">{item.suggestion}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DesignSuggestions;