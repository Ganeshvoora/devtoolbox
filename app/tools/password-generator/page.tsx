"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clipboard, RefreshCw, Check, Eye, EyeOff, Shield } from 'lucide-react';

export default function PasswordGenerator() {
  // State for password options
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  
  // State for password and UI
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  // Character sets
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  const similarChars = 'iIlL10oO';
  const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';
  
  const calculateStrength = useCallback(() => {
    let score = 0;
    
    // Length contribution (max 4 points)
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (password.length >= 20) score += 1;
    
    // Character diversity contribution (max 4 points)
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Set strength (0-4)
    setStrength(Math.min(Math.floor(score / 2), 4));
  }, [password]);

  const generatePassword = useCallback(() => {
    // Ensure at least one character type is selected
    if (!(includeUppercase || includeLowercase || includeNumbers || includeSymbols)) {
      setPassword('Select at least one character type');
      return;
    }

    // Build character pool based on selected options
    let charPool = '';
    if (includeUppercase) charPool += uppercaseChars;
    if (includeLowercase) charPool += lowercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;

    // Remove excluded characters if options are selected
    if (excludeSimilar) {
      similarChars.split('').forEach(char => {
        charPool = charPool.replace(new RegExp(char, 'g'), '');
      });
    }

    if (excludeAmbiguous) {
      ambiguousChars.split('').forEach(char => {
        // Need to escape special regex characters
        const escapedChar = char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        charPool = charPool.replace(new RegExp(escapedChar, 'g'), '');
      });
    }

    if (charPool.length === 0) {
      setPassword('No characters available with current settings');
      return;
    }

    // Generate password
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      newPassword += charPool[randomIndex];
    }

    setPassword(newPassword);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, excludeAmbiguous]);
  // Generate password on mount and when options change
  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, excludeAmbiguous, generatePassword]);

  // Calculate password strength
  useEffect(() => {
    calculateStrength();
  }, [password, calculateStrength]);


  const copyToClipboard = () => {
    if (password && password.indexOf('Select') === -1 && password.indexOf('No characters') === -1) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStrengthLabel = () => {
    const labels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    return labels[strength];
  };
  
  const getStrengthColor = () => {
    const colors = ['#ff4747', '#ffa347', '#ffdf47', '#a8ff47', '#47ff9e'];
    return colors[strength];
  };

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      <div className="container mx-auto py-12 px-4">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8 flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg mr-4">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Password Generator</h1>
              <p className="text-gray-400 mt-1">Create strong, secure passwords for your accounts</p>
            </div>
          </div>

          {/* Password Display */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800 shadow-lg">
            <div className="flex items-center">
              <motion.div 
                className="flex-1 font-mono text-xl overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 py-2"
                animate={{ opacity: showPassword ? 1 : 0.5 }}
              >
                {showPassword ? password : password.replace(/./g, '•')}
              </motion.div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-gray-400 hover:text-white focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <button 
                  onClick={generatePassword}
                  className="p-2 text-gray-400 hover:text-white focus:outline-none"
                  aria-label="Generate new password"
                >
                  <RefreshCw size={20} />
                </button>
                <motion.button 
                  onClick={copyToClipboard}
                  className={`p-2 ${copied ? 'text-green-400' : 'text-gray-400 hover:text-white'} focus:outline-none`}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Copy to clipboard"
                >
                  {copied ? <Check size={20} /> : <Clipboard size={20} />}
                </motion.button>
              </div>
            </div>

            {/* Strength indicator */}
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Password Strength</span>
                <span className="text-xs font-medium" style={{ color: getStrengthColor() }}>
                  {getStrengthLabel()}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full" 
                  style={{ backgroundColor: getStrengthColor() }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${(strength + 1) * 20}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Password Options</h2>
            
            {/* Length */}
            <div className="mb-6">
              <div className="flex justify-between">
                <label htmlFor="length" className="block text-sm font-medium text-gray-300">
                  Password Length: {length} characters
                </label>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">
                  {length < 12 ? '⚠️ Recommended: 12+' : '✓ Good length'}
                </span>
              </div>
              <input
                id="length"
                type="range"
                min="6"
                max="32"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer my-3 accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>6</span>
                <span>12</span>
                <span>20</span>
                <span>32</span>
              </div>
            </div>

            {/* Character types */}
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-medium text-gray-300">Include Characters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={() => setIncludeUppercase(!includeUppercase)}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-sm text-gray-300">Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={() => setIncludeLowercase(!includeLowercase)}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-sm text-gray-300">Lowercase (a-z)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={() => setIncludeNumbers(!includeNumbers)}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-sm text-gray-300">Numbers (0-9)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={() => setIncludeSymbols(!includeSymbols)}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-sm text-gray-300">Symbols (!@#$%^&*)</span>
                </label>
              </div>
            </div>

            {/* Advanced options */}
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-medium text-gray-300">Advanced Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={excludeSimilar}
                    onChange={() => setExcludeSimilar(!excludeSimilar)}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <div>
                    <span className="text-sm text-gray-300">Exclude Similar Characters</span>
                    <p className="text-xs text-gray-500">i, I, l, L, 1, o, O, 0</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={excludeAmbiguous}
                    onChange={() => setExcludeAmbiguous(!excludeAmbiguous)}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <div>
                    <span className="text-sm text-gray-300">Exclude Ambiguous Characters</span>
                    <p className="text-xs text-gray-500">{ }[ ]( )/ \ &apos; &quot; ` ~ , ; : . &lt; &gt;</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={generatePassword}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate New Password
            </button>
          </div>

          {/* Password tips */}
          <div className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Password Security Tips</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-400 mr-2">✓</div>
                <span>Use a different password for each account</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-400 mr-2">✓</div>
                <span>Make passwords at least 12-16 characters long</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-400 mr-2">✓</div>
                <span>Include a mix of letters, numbers, and symbols</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-400 mr-2">✓</div>
                <span>Consider using a password manager to store your passwords securely</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-400 mr-2">✓</div>
                <span>Enable two-factor authentication when available</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}