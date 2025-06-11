"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode, MessageSquare, Loader2, AlertTriangle } from 'lucide-react';

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "typescript", label: "TypeScript" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

export default function CodeExplainer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const apiKey = "AIzaSyCgZmaMu3z1WSVv8nP6--22eL1NSHtufiM";

  const explainCode = async () => {
    // Reset states
    setExplanation(null);
    setError(null);
    
    // Validate input
    if (!code.trim()) {
      setError('Please enter some code to explain.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const prompt = `Explain this ${language} code in detail. Provide a clear explanation that would help a beginner understand how it works. Include key concepts, what the code does, and if relevant, an example of it in action:\n\n${code}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Failed to generate explanation');
      }
      
      if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
        throw new Error('Invalid response from API');
      }
      
      setExplanation(data.candidates[0].content.parts[0].text);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : 'Failed to generate explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      <motion.div 
        className="container mx-auto py-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            className="inline-block p-4 rounded-full bg-blue-600/20 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <FileCode size={36} className="text-blue-500" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">Code Explainer</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Understand any code snippet with AI assistance. Paste your code and get a detailed explanation.
          </p>
        </div>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Input Section */}
          <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="mb-4">
              <label htmlFor="codeInput" className="block text-sm font-medium text-gray-400 mb-2">
                Your Code
              </label>
              <textarea
                id="codeInput"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full h-64 p-4 font-mono text-sm bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-full sm:w-auto">
                <label htmlFor="languageSelect" className="block text-sm font-medium text-gray-400 mb-2">
                  Language
                </label>
                <select
                  id="languageSelect"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full sm:w-48 p-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={explainCode}
                disabled={isLoading}
                className="mt-6 sm:mt-0 sm:ml-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-md font-medium flex items-center justify-center min-w-[160px] transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <MessageSquare size={18} className="mr-2" />
                    Explain Code
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Explanation Section */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 transition-all">
            <div className="border-b border-gray-800 px-6 py-3">
              <h2 className="font-medium">Explanation</h2>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="flex items-start space-x-3 text-red-400 bg-red-900/20 p-4 rounded-md">
                  <AlertTriangle size={20} className="mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-blue-500 mb-4" />
                  <p className="text-gray-400">Analyzing your code...</p>
                </div>
              )}
              
              {explanation && !isLoading && !error && (
                <motion.div 
                  className="explanation-content prose prose-invert max-w-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gray-800/50 p-4 rounded-md mb-6 font-mono text-sm overflow-x-auto">
                    <pre>{code}</pre>
                  </div>
                  
                  {explanation.split('\n').map((paragraph, idx) => {
                    // Render headers differently
                    if (paragraph.startsWith('##')) {
                      return <h3 key={idx} className="text-xl font-bold mt-6 mb-3 text-blue-400">{paragraph.replace(/^##\s*/, '')}</h3>;
                    }
                    if (paragraph.startsWith('#')) {
                      return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3 text-blue-400">{paragraph.replace(/^#\s*/, '')}</h2>;
                    }
                    // Skip empty paragraphs
                    if (!paragraph.trim()) return null;
                    // Regular paragraph
                    return <p key={idx} className="mb-4" dangerouslySetInnerHTML={{__html: formatText(paragraph)}} />;
                  })}
                </motion.div>
              )}
              
              {!explanation && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <MessageSquare size={48} className="mb-4 opacity-20" />
                  <p>Enter your code and click &quot;Explain Code&quot; to get an explanation</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Tips Section */}
          <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h3 className="font-medium mb-3">Tips for better explanations:</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Provide complete code snippets rather than fragments</li>
              <li>• Make sure to select the correct language</li>
              <li>• For complex code, add comments to highlight areas you need explained</li>
              <li>• The AI works best with code that has proper syntax and formatting</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Helper function to format code within explanation text
function formatText(text: string): string {
  // Format inline code
  let formatted = text.replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1 py-0.5 rounded text-blue-300">$1</code>');
  
  // Bold text
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Italics
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  return formatted;
}