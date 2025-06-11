"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code2,
  FileJson,
  FileText,
  KeyRound,
  ShieldCheck,
  Fingerprint,
  FileCode,
  PenTool,
  Layers,
  TerminalSquare,
  Search
} from 'lucide-react';

// Define tool categories and tools
// Define tool categories and tools
const toolsData = [
  {
    category: 'Developer Tools',
    description: 'Essential tools for building and testing applications',
    tools: [
      { name: 'API Tester', path: '/tools/apitester', icon: TerminalSquare, description: 'Test API endpoints with custom requests' },
      { name: 'Code Explain', path: '/tools/code-explain', icon: FileCode, description: 'Get explanations for code snippets' },
      { name: 'Code Preview', path: '/tools/code-preview', icon: Code2, description: 'Preview and highlight code in various languages' },
      { name: 'QR Code Generator', path: '/tools/qrcode', icon: Layers, description: 'Generate QR codes from URLs or text' },
      { name: 'Resource Finder', path: '/tools/resourcefinder', icon: Search, description: 'Find development resources and libraries' },
    ]
  },
  {
    category: 'Data Tools',
    description: 'Format and transform data between formats',
    tools: [
      { name: 'JSON Formatter', path: '/tools/json-formatter', icon: FileJson, description: 'Format and validate JSON data' },
      { name: 'Markdown Preview', path: '/tools/markdown', icon: FileText, description: 'Preview markdown with live editing' },
    ]
  },
  {
    category: 'Utilities',
    description: 'Helpful utilities for daily development tasks',
    tools: [
      { name: 'Color Picker', path: '/tools/color-picker', icon: PenTool, description: 'Select and convert between color formats' },
      { name: 'UUID Generator', path: '/tools/uuid-generator', icon: Fingerprint, description: 'Generate random UUIDs and GUIDs' },
      { name: 'Hash Generator', path: '/tools/hash-generator', icon: ShieldCheck, description: 'Generate various hash values' },
      { name: 'Password Generator', path: '/tools/password-generator', icon: KeyRound, description: 'Create strong, secure passwords' },
    ]
  }
];

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter tools based on search query and selected category
  const filteredTools = useMemo(() => {
    return toolsData
      .map(category => {
        // Filter tools in this category based on search
        const filteredCategoryTools = category.tools.filter(tool => 
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // Return category with filtered tools
        return {
          ...category,
          tools: filteredCategoryTools
        };
      })
      // If category selected, only show that category
      .filter(category => !selectedCategory || category.category === selectedCategory)
      // Filter out categories with no matching tools
      .filter(category => category.tools.length > 0);
  }, [searchQuery, selectedCategory]);

  // Get all categories for filter options
  const allCategories = toolsData.map(category => category.category);
  
  // Calculate total tools count
  const totalTools = toolsData.reduce((sum, category) => sum + category.tools.length, 0);
  
  // Calculate filtered tools count
  const filteredToolsCount = filteredTools.reduce((sum, category) => sum + category.tools.length, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">Developer Tools</h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            A collection of useful web-based tools for developers, designers, and digital professionals.
            All tools are free, private, and process data in your browser.
          </p>
        </motion.div>

        {/* Search and filter section */}
        <div className="mb-10">
          <motion.div 
            className="bg-gray-900 rounded-lg p-4 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Search input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category filter */}
            <div className="flex-shrink-0 sm:w-56">
              <select
                className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {allCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>

        {/* Results statistics */}
        <motion.div 
          className="mb-6 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {searchQuery || selectedCategory ? (
            <p>Showing {filteredToolsCount} of {totalTools} tools</p>
          ) : (
            <p>Showing all {totalTools} tools</p>
          )}
        </motion.div>

        {/* No results message */}
        {filteredTools.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Layers className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-300">No tools found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter to find what you&apos;re looking for.</p>
          </motion.div>
        )}

        {/* Tools grid by category */}
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTools.map((category) => (
            <motion.div 
              key={category.category}
              variants={itemVariants}
              className="border-t border-gray-800 pt-8"
            >
              <h2 className="text-2xl font-bold mb-1">{category.category}</h2>
              <p className="text-gray-500 mb-6">{category.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {category.tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div
                      key={tool.path}
                      variants={itemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Link href={tool.path} passHref>
                        <div className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-lg p-5 h-full flex flex-col cursor-pointer transition-all duration-300 hover:bg-gray-800">
                          <div className="flex items-center mb-3">
                            <div className="bg-blue-500 bg-opacity-20 rounded-lg p-2 mr-3">
                              <Icon className="h-5 w-5 text-blue-400" />
                            </div>
                            <h3 className="font-semibold">{tool.name}</h3>
                          </div>
                          <p className="text-sm text-gray-400 flex-grow">{tool.description}</p>
                          <div className="mt-4 pt-2 border-t border-gray-800 flex justify-between items-center text-xs">
                            <span className="text-gray-500">Web Tool</span>
                            <span className="text-blue-400 flex items-center">
                              Open tool
                              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}