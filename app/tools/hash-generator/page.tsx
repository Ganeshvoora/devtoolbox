"use client";
import PrivateRoute from "@/components/PrivateRoute";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';

// Define supported hash algorithms
const HASH_ALGORITHMS = [
  { name: 'SHA-1', value: 'SHA-1' },
  { name: 'SHA-256', value: 'SHA-256' },
  { name: 'SHA-384', value: 'SHA-384' },
  { name: 'SHA-512', value: 'SHA-512' }
];

export default function HashGenerator() {
  // State for user input
  const [inputText, setInputText] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('SHA-256');
  const [hashResults, setHashResults] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isComputing, setIsComputing] = useState(false);
  const [copiedHash, setCopiedHash] = useState('');

  // Compute text hashes using Web Crypto API
  const generateTextHashes = useCallback(async () => {
    if (!inputText) {
      setHashResults({});
      return;
    }
    
    setIsComputing(true);
    setErrorMessage('');
    
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(inputText);
      
      const results: { [key: string]: string } = {};
      
      // Generate hash for each algorithm
      for (const algo of HASH_ALGORITHMS) {
        try {
          const hashBuffer = await crypto.subtle.digest(
            algo.value, 
            data
          );
          
          // Convert buffer to hex string
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          results[algo.value] = hashHex;
        } catch  {
          results[algo.value] = `Error generating ${algo.name}`;
        }
      }
      
      setHashResults(results);
    } catch (error) {
      setErrorMessage('An error occurred while generating the hash.');
      console.error('Error generating hash:', error);
    } finally {
      setIsComputing(false);
    }
  }, [inputText]);
  // Generate hashes when text input changes
  useEffect(() => {
    if (inputText) {
      generateTextHashes();
    } else {
      setHashResults({});
    }
  }, [inputText, selectedAlgorithm, generateTextHashes]);


  // Copy hash to clipboard
  const copyToClipboard = (hash: string, algorithm: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(algorithm);
    setTimeout(() => setCopiedHash(''), 2000);
  };

  return (
    <PrivateRoute>
    <div className="min-h-screen bg-black text-white pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-12 px-4 max-w-4xl"
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-lg mr-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Hash Generator</h1>
            <p className="text-gray-400">Generate secure hash values from text</p>
          </div>
        </div>

        {/* Algorithm Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-400 mb-2">Select Hash Algorithm</label>
          <div className="flex flex-wrap gap-2">
            {HASH_ALGORITHMS.map((algorithm) => (
              <button
                key={algorithm.value}
                onClick={() => setSelectedAlgorithm(algorithm.value)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  selectedAlgorithm === algorithm.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {algorithm.name}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Section */}
        <div className="mb-8">
          <label htmlFor="hashInput" className="block text-sm font-medium text-gray-400 mb-2">
            Enter text to hash
          </label>
          <textarea
            id="hashInput"
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste text here..."
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errorMessage && (
            <div className="mt-2 text-red-500 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errorMessage}
            </div>
          )}
        </div>

        {/* Hash Results for Text */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Hash Results</h2>
          
          {isComputing ? (
            <div className="flex justify-center py-8">
              <div className="flex items-center">
                <RefreshCw className="animate-spin h-5 w-5 mr-2 text-blue-500" />
                <span className="text-gray-400">Computing hashes...</span>
              </div>
            </div>
          ) : inputText ? (
            <div className="space-y-4">
              {HASH_ALGORITHMS.map((algorithm) => (
                <div key={algorithm.value} className="bg-gray-900 rounded-md p-3 border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-400">{algorithm.name}</span>
                    <button
                      onClick={() => copyToClipboard(hashResults[algorithm.value] || '', algorithm.value)}
                      className="p-1 text-gray-400 hover:text-white focus:outline-none"
                      disabled={!hashResults[algorithm.value]}
                    >
                      {copiedHash === algorithm.value ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-sm break-all bg-gray-950 p-2 rounded">
                    {hashResults[algorithm.value] || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Enter some text above to generate hash values
            </div>
          )}
        </div>

        {/* Hash Information */}
        <div className="bg-gray-900 rounded-md p-4 border border-gray-800">
          <h3 className="text-lg font-medium mb-3">About Hash Functions</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              Hash functions convert data of arbitrary size to a fixed-size value. They are used in digital signatures, password verification, and data integrity checking.
            </p>
            <div className="pt-2">
              <h4 className="font-medium text-gray-300">Common Hash Algorithms:</h4>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li><strong>SHA-1</strong> - 160-bit hash (no longer considered secure)</li>
                <li><strong>SHA-256</strong> - 256-bit hash, part of SHA-2 family</li>
                <li><strong>SHA-384</strong> - 384-bit hash, part of SHA-2 family</li>
                <li><strong>SHA-512</strong> - 512-bit hash, part of SHA-2 family</li>
              </ul>
            </div>
            <p className="pt-2">
              For security purposes, modern applications should use SHA-256 or stronger algorithms.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
    </PrivateRoute>
  );
}