"use client";
import PrivateRoute from "@/components/PrivateRoute";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Copy, RefreshCw, Check, ArrowDownToLine, Trash, PlusCircle } from 'lucide-react';
import { v1 as uuidv1, v4 as uuidv4, NIL as NIL_UUID } from 'uuid';

type UuidVersion = 'v1' | 'v4' | 'nil';
type UuidFormat = 'default' | 'uppercase' | 'lowercase' | 'no-hyphens';

interface GeneratedUuid {
  id: string;
  value: string;
  timestamp?: number;
}

export default function UuidGenerator() {
  // State for UUID options
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [format, setFormat] = useState<UuidFormat>('default');
  const [count, setCount] = useState<number>(5);
  const [uuids, setUuids] = useState<GeneratedUuid[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);
  
  // Function to generate UUIDs based on selected options
  const generateUuids= useCallback(() => {
    const newUuids: GeneratedUuid[] = [];
    
    for (let i = 0; i < count; i++) {
      let uuid: string;
      const timestamp = Date.now();
      
      // Generate UUID based on version
      switch(version) {
        case 'v1':
          uuid = uuidv1();
          break;
        case 'v4':
          uuid = uuidv4();
          break;
        case 'nil':
          uuid = NIL_UUID;
          break;
        default:
          uuid = uuidv4();
      }
      
      // Format UUID based on selected format
      switch(format) {
        case 'uppercase':
          uuid = uuid.toUpperCase();
          break;
        case 'lowercase':
          uuid = uuid.toLowerCase();
          break;
        case 'no-hyphens':
          uuid = uuid.replace(/-/g, '');
          break;
        default:
          // Keep default format
          break;
      }
      
      newUuids.push({
        id: `uuid-${i}-${timestamp}`,
        value: uuid,
        timestamp: version === 'v1' ? timestamp : undefined
      });
    }
    
    setUuids(newUuids);
    setAllCopied(false);
    setCopied(null);
  }, [version, format, count]);
  // Generate UUIDs on mount and when options change
  useEffect(() => {
    generateUuids();
  }, [version, format, count, generateUuids]);


  // Copy individual UUID to clipboard
  const copyUuid = (value: string, id: string) => {
    navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  // Copy all UUIDs to clipboard
  const copyAllUuids = () => {
    const allUuidsText = uuids.map(uuid => uuid.value).join('\n');
    navigator.clipboard.writeText(allUuidsText);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 1500);
  };

  // Download UUIDs as a text file
  const downloadUuids = () => {
    const allUuidsText = uuids.map(uuid => uuid.value).join('\n');
    const blob = new Blob([allUuidsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear generated UUIDs
  const clearUuids = () => {
    setUuids([]);
    setAllCopied(false);
    setCopied(null);
  };

  // Get version description
  const getVersionDescription = () => {
    switch(version) {
      case 'v1':
        return 'Time-based UUID. Contains the MAC address of the computer and current timestamp.';
      case 'v4':
        return 'Random UUID. Generates completely random identifiers.';
      case 'nil':
        return 'Nil UUID. Special UUID with all zeros.';
      default:
        return '';
    }
  };

  return (
    <PrivateRoute>
    <div className="min-h-screen bg-black text-white pb-16">
      <div className="container mx-auto py-12 px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center mb-8">
            <div className="bg-blue-600 p-3 rounded-lg mr-4">
              <Fingerprint className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">UUID Generator</h1>
              <p className="text-gray-400 mt-1">Generate unique identifiers for your applications</p>
            </div>
          </div>
          
          {/* Options Panel */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Generator Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* UUID Version */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  UUID Version
                </label>
                <select
                  value={version}
                  onChange={(e) => setVersion(e.target.value as UuidVersion)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="v4">Version 4 (Random)</option>
                  <option value="v1">Version 1 (Time-based)</option>
                  <option value="nil">Nil UUID (All zeros)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">{getVersionDescription()}</p>
              </div>
              
              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as UuidFormat)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Default (Lowercase with hyphens)</option>
                  <option value="uppercase">Uppercase with hyphens</option>
                  <option value="lowercase">Lowercase with hyphens</option>
                  <option value="no-hyphens">No hyphens</option>
                </select>
              </div>
              
              {/* Count */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Number of UUIDs
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={generateUuids}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New UUIDs
              </button>
              
              <button
                onClick={copyAllUuids}
                disabled={uuids.length === 0}
                className={`px-4 py-2 ${uuids.length === 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'} rounded-md flex items-center text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
              >
                {allCopied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                Copy All
              </button>
              
              <button
                onClick={downloadUuids}
                disabled={uuids.length === 0}
                className={`px-4 py-2 ${uuids.length === 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'} rounded-md flex items-center text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
              >
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Download as .txt
              </button>
              
              <button
                onClick={clearUuids}
                disabled={uuids.length === 0}
                className={`px-4 py-2 ${uuids.length === 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'} rounded-md flex items-center text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
              >
                <Trash className="w-4 h-4 mr-2" />
                Clear All
              </button>
            </div>
          </div>
          
          {/* Results */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-lg">
            <div className="border-b border-gray-800 px-6 py-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Generated UUIDs</h2>
              {uuids.length > 0 && (
                <div className="text-sm text-gray-400">
                  {uuids.length} {uuids.length === 1 ? 'UUID' : 'UUIDs'} generated
                </div>
              )}
            </div>
            
            <div className="p-6">
              {uuids.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Fingerprint className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No UUIDs generated yet</p>
                  <button
                    onClick={generateUuids}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center mx-auto text-white font-medium"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Generate UUIDs
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {uuids.map((uuid) => (
                    <motion.div
                      key={uuid.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-800 rounded-md p-3 flex items-center justify-between group"
                    >
                      <div className="font-mono text-sm break-all flex-1">
                        {uuid.value}
                      </div>
                      <button
                        onClick={() => copyUuid(uuid.value, uuid.id)}
                        className="ml-3 p-1.5 text-gray-400 hover:text-white focus:outline-none opacity-50 group-hover:opacity-100 transition-opacity"
                        title="Copy to clipboard"
                      >
                        {copied === uuid.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Information Section */}
          <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-3">About UUIDs</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>
                UUID (Universally Unique Identifier) is a 128-bit identifier that is unique across all space and time. 
                UUIDs are used in many computing systems to identify resources without requiring a central registry.
              </p>
              
              <div>
                <h4 className="font-medium text-gray-300 mb-1">UUID Formats:</h4>
                <ul className="list-disc list-inside space-y-1 ml-1">
                  <li><strong>Version 1:</strong> Time-based. Generated using the current timestamp and MAC address of the computer.</li>
                  <li><strong>Version 4:</strong> Random. Generated using random or pseudo-random numbers. Most commonly used version.</li>
                  <li><strong>Nil UUID:</strong> Special UUID consisting of all zeros (00000000-0000-0000-0000-000000000000).</li>
                </ul>
              </div>
              
              <p>
                UUIDs are typically represented as 32 hexadecimal characters, displayed in 5 groups separated by hyphens: 
                8-4-4-4-12 format (e.g., 550e8400-e29b-41d4-a716-446655440000).
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </PrivateRoute>
  );
}