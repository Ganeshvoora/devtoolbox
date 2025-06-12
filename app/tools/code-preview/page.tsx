"use client";
import PrivateRoute from "@/components/PrivateRoute";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Trash, Code, FileType, FileCode } from 'lucide-react';

export default function CodePreview() {
  // State for active tab and code content
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  
  // Ref for the iframe
  const previewFrameRef = useRef<HTMLIFrameElement>(null);

  // Function to run the code
  const runCode = () => {
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>${jsCode}</script>
      </body>
      </html>
    `;

    if (previewFrameRef.current) {
      previewFrameRef.current.srcdoc = content;
    }
  };

  // Function to clear all code
  const clearCode = () => {
    setHtmlCode('');
    setCssCode('');
    setJsCode('');
    
    // Update preview with empty content
    if (previewFrameRef.current) {
      previewFrameRef.current.srcdoc = '';
    }
  };

  // Clear output button functionality
  const clearOutput = () => {
    if (previewFrameRef.current) {
      previewFrameRef.current.srcdoc = '';
    }
  };

  // Handle tab changes
  const handleTabChange = (tab: 'html' | 'css' | 'js') => {
    setActiveTab(tab);
  };

  return (
    <PrivateRoute>
    <div className="min-h-screen bg-black text-white">
      <motion.div 
        className="container mx-auto py-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Code className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold">Live Code Runner</h1>
          <p className="text-gray-400 mt-2">Write and test your code in real-time</p>
        </div>

        {/* Editor Section */}
        <div className="mb-6">
          {/* Tab Navigation */}
          <div className="editor-tabs flex border-b border-gray-700">
            <button 
              onClick={() => handleTabChange('html')}
              className={`tab-btn px-4 py-2 font-medium ${activeTab === 'html' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'}`}
              data-lang="html"
            >
              <Code className="inline-block mr-2 h-4 w-4" /> HTML
            </button>
            <button 
              onClick={() => handleTabChange('css')}
              className={`tab-btn px-4 py-2 font-medium ${activeTab === 'css' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'}`}
              data-lang="css"
            >
              <FileType className="inline-block mr-2 h-4 w-4" /> CSS
            </button>
            <button 
              onClick={() => handleTabChange('js')}
              className={`tab-btn px-4 py-2 font-medium ${activeTab === 'js' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'}`}
              data-lang="js"
            >
              <FileCode className="inline-block mr-2 h-4 w-4" /> JavaScript
            </button>
          </div>

          {/* Editors */}
          <div className="editors bg-gray-900 border border-gray-800 rounded-md">
            <textarea
              id="htmlEditor"
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className={`w-full h-64 p-4 font-mono text-sm bg-gray-900 text-white resize-none focus:outline-none ${
                activeTab !== 'html' ? 'hidden' : ''
              }`}
              placeholder="Enter HTML code here"
            ></textarea>
            <textarea
              id="cssEditor"
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              className={`w-full h-64 p-4 font-mono text-sm bg-gray-900 text-white resize-none focus:outline-none ${
                activeTab !== 'css' ? 'hidden' : ''
              }`}
              placeholder="Enter CSS code here"
            ></textarea>
            <textarea
              id="jsEditor"
              value={jsCode}
              onChange={(e) => setJsCode(e.target.value)}
              className={`w-full h-64 p-4 font-mono text-sm bg-gray-900 text-white resize-none focus:outline-none ${
                activeTab !== 'js' ? 'hidden' : ''
              }`}
              placeholder="Enter JavaScript code here"
            ></textarea>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="editor-actions flex space-x-4 mb-6">
          <button 
            id="runCode"
            onClick={runCode}
            className="cta-button flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Play className="mr-2 h-4 w-4" /> Run Code
          </button>
          <button 
            id="clearCode"
            onClick={clearCode}
            className="filter-btn flex items-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Trash className="mr-2 h-4 w-4" /> Clear
          </button>
        </div>

        {/* Preview Container */}
        <div className="preview-container bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="output-header bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-700">
            <h3 className="text-white font-medium">Output:</h3>
            <div className="output-controls">
              <button 
                id="clearOutput"
                onClick={clearOutput}
                className="filter-btn text-sm bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded transition-colors"
              >
                Clear Output
              </button>
            </div>
          </div>
          <div className="preview-wrapper bg-white">
            <iframe 
              id="previewFrame"
              ref={previewFrameRef}
              className="w-full h-96 border-0"
              title="Code Preview"
              sandbox="allow-scripts"
            ></iframe>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">Tips:</h3>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
            <li>Write HTML, CSS, and JavaScript code in their respective tabs</li>
            <li>Click &quot;Run Code&quot; to execute and see results in the preview</li>
            <li>The preview is sandboxed for security</li>
            <li>External resources can be included in your HTML</li>
          </ul>
        </div>
      </motion.div>
    </div>
    </PrivateRoute>
  );
}