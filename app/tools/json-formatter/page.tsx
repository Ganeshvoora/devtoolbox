'use client';

import { useState, useRef } from 'react';
import { motion ,AnimatePresence} from 'framer-motion';

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [errorPosition, setErrorPosition] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [tabSize, setTabSize] = useState(2);
  
  const outputRef = useRef<HTMLPreElement>(null);
  
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, tabSize);
      setOutput(formatted);
      setError('');
      setErrorPosition(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      // Try to extract position of error if available
      const match = /position (\d+)/.exec(e instanceof Error ? e.message : '');
      setErrorPosition(match ? parseInt(match[1]) : null);
      setOutput('');
    }
  };
  
  const copyToClipboard = () => {
    if (!output) return;
    
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setErrorPosition(null);
  };
  
  const prettifyWithHighlight = () => {
    if (!error || !errorPosition) return null;
    
    // Create highlighted error visualization
    let errorSection = null;
    try {
      const before = input.substring(0, Math.max(0, errorPosition - 20));
      const errorPart = input.substring(
        Math.max(0, errorPosition - 20), 
        Math.min(input.length, errorPosition + 20)
      );
      const after = input.substring(Math.min(input.length, errorPosition + 20));
      
      errorSection = (
        <div className="bg-gray-900 rounded p-3 border border-red-500 mt-2 overflow-x-auto">
          <p className="text-gray-400 mb-2">Error around position {errorPosition}:</p>
          <div className="font-mono text-sm">
            <span className="text-gray-500">...{before.slice(-10)}</span>
            <span className="bg-red-900 text-white px-1">{errorPart.slice(0, 40)}</span>
            <span className="text-gray-500">{after.slice(0, 10)}...</span>
          </div>
        </div>
      );
    } catch {
      // Fallback if we can't parse the error position correctly
      errorSection = null;
    }
    
    return errorSection;
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-12 px-4">
        <motion.div
          className="max-w-6xl mx-auto bg-gray-900 rounded-lg shadow-lg border border-gray-800 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center mb-6">
              <motion.div 
                className="text-blue-400 text-4xl mr-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold">JSON Formatter</h1>
                <p className="text-gray-400">Format, validate and beautify your JSON</p>
              </div>
            </div>
            
            <motion.div
              className="flex flex-col md:flex-row gap-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold text-gray-300">Input JSON</label>
                  <button 
                    onClick={clearAll}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800"
                  >
                    Clear All
                  </button>
                </div>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Paste your JSON here..."
                  className="w-full h-64 p-3 text-sm font-mono bg-gray-800 text-gray-200 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold text-gray-300">Formatted Output</label>
                  {output && (
                    <motion.button 
                      onClick={copyToClipboard}
                      className="text-xs flex items-center gap-1 text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-12a2 2 0 00-2-2h-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {isCopied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  )}
                </div>
                <pre
                  ref={outputRef}
                  className={`w-full h-64 p-3 text-sm font-mono bg-gray-800 text-gray-200 border ${
                    error ? 'border-red-500' : 'border-gray-700'
                  } rounded overflow-auto`}
                >
                  {output || (
                    <span className="text-gray-500">
                      {error ? 'Invalid JSON input' : 'Your formatted JSON will appear here'}
                    </span>
                  )}
                </pre>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center">
                <label className="mr-2 text-sm text-gray-300">Indentation:</label>
                <select
                  value={tabSize}
                  onChange={e => setTabSize(Number(e.target.value))}
                  className="bg-gray-800 text-white border border-gray-700 rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                  <option value="6">6 spaces</option>
                  <option value="8">8 spaces</option>
                </select>
              </div>
              
              <motion.button
                onClick={formatJSON}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                </svg>
                Format JSON
              </motion.button>
              
              {output && (
                <motion.button
                  onClick={() => {
                    setInput(output);
                    setOutput('');
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Use Output as Input
                </motion.button>
              )}
            </motion.div>
          </div>
          
          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="p-4 bg-red-900 bg-opacity-20 border-t border-red-800"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-red-400 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-400">JSON Parse Error</h3>
                    <p className="text-red-200">{error}</p>
                    {prettifyWithHighlight()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tools and Help Section */}
          <motion.div 
            className="bg-gray-800 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-300">About JSON Formatter</h3>
            <p className="text-gray-400 mb-4">
              This tool helps you format and validate JSON data. Paste your unformatted JSON into the input field
              and click &quot;Format JSON&quot; to beautify it. The tool will detect errors and highlight their positions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 p-4 rounded border border-gray-800">
                <h4 className="font-semibold mb-2 text-blue-400">Features</h4>
                <ul className="text-sm text-gray-400 space-y-1 list-disc pl-4">
                  <li>Format and indent JSON</li>
                  <li>Validate JSON syntax</li>
                  <li>Error highlighting</li>
                  <li>Copy to clipboard</li>
                  <li>Adjustable indentation</li>
                </ul>
              </div>
              
              <div className="bg-gray-900 p-4 rounded border border-gray-800">
                <h4 className="font-semibold mb-2 text-blue-400">Sample JSON</h4>
                <button
                  onClick={() => setInput('{"name":"DevToolBox","version":1.0,"tools":["formatter","validator"]}')}
                  className="text-sm text-blue-400 hover:text-blue-300 underline"
                >
                  Load Sample JSON
                </button>
              </div>
              
              <div className="bg-gray-900 p-4 rounded border border-gray-800">
                <h4 className="font-semibold mb-2 text-blue-400">Security</h4>
                <p className="text-sm text-gray-400">
                  All processing happens in your browser. Your JSON data is never sent to any server.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}