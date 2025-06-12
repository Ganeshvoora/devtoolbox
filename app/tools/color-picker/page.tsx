"use client";
import PrivateRoute from "@/components/PrivateRoute";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Copy, Check} from 'lucide-react';

export default function ColorPicker() {
  // State for color values
  const [color, setColor] = useState("#5E72EB");
  const [rgba, setRgba] = useState({ r: 94, g: 114, b: 235, a: 1 });
  const [hsla, setHsla] = useState({ h: 230, s: 78, l: 64, a: 1 });
  
  // State for UI
  const [activeTab, setActiveTab] = useState("hex");
  const [copied, setCopied] = useState(false);
  

  // Update derived color values when main color changes
  // useEffect(() => {
  //   // Convert hex to rgba
  //   const hexToRgb = (hex: string) => {
  //     const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  //     return result ? {
  //       r: parseInt(result[1], 16),
  //       g: parseInt(result[2], 16),
  //       b: parseInt(result[3], 16),
  //       a: rgba.a // Keep current alpha
  //     } : rgba;
  //   };
    
  //   const rgbToHsl = (r: number, g: number, b: number, a: number) => {
  //     r /= 255;
  //     g /= 255;
  //     b /= 255;
      
  //     const max = Math.max(r, g, b);
  //     const min = Math.min(r, g, b);
  //     let h = 0, s = 0
  //     const l = (max + min) / 2;
      
  //     if (max !== min) {
  //       const d = max - min;
  //       s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
  //       switch (max) {
  //         case r: h = (g - b) / d + (g < b ? 6 : 0); break;
  //         case g: h = (b - r) / d + 2; break;
  //         case b: h = (r - g) / d + 4; break;
  //       }
        
  //       h *= 60;
  //     }
      
  //     return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100), a };
  //   };
    
  //   const rgb = hexToRgb(color);
  //   setRgba(rgb);
    
  //   const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b, rgb.a);
  //   setHsla(hsl);
  // }, [color]);


  useEffect(() => {
  // Convert hex to rgba, keeping the previous alpha value
  setRgba(prevRgba => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    const newRgba = result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: prevRgba.a // Keep previous alpha
        }
      : prevRgba;

    // Convert to HSL
    const r = newRgba.r / 255;
    const g = newRgba.g / 255;
    const b = newRgba.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }

    setHsla({
      h: Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
      a: newRgba.a
    });

    return newRgba;
  });
}, [color]);


  //cmd work if rgba not there but rgba is needed for dependency arry

  // Update color when alpha changes separately
  useEffect(() => {
    setHsla(prev => ({ ...prev, a: rgba.a }));
  }, [rgba.a]);


  // Update color from hex input
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  // Update alpha/transparency
  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const alpha = parseFloat(e.target.value);
    setRgba(prev => ({ ...prev, a: alpha }));
  };

  // Format color values based on selected format
  const getColorString = () => {
    switch (activeTab) {
      case 'hex':
        return color;
      case 'rgb':
        return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
      case 'hsl':
        return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`;
      default:
        return color;
    }
  };

  // Copy color to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getColorString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

 

  return (
    <PrivateRoute>
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-12 px-4">
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-block p-3 rounded-full bg-blue-600/20 mb-3">
              <Palette className="h-8 w-8 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Color Picker</h1>
            <p className="text-gray-400">Select colors and get values in different formats</p>
          </div>

          {/* Main Content */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            {/* Color Preview */}
            <div className="mb-6">
              <div className="relative h-40 rounded-lg mb-4 overflow-hidden">
                {/* Checkered background to show transparency */}
                <div className="absolute inset-0 bg-checkered"></div>
                {/* Color overlay with current color + alpha */}
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})` }}
                ></div>
              </div>
              
              {/* Color Input and Save Button */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    className="w-full h-10 rounded-md cursor-pointer bg-transparent"
                  />
                </div>
                
              </div>
            </div>

            {/* Alpha/Transparency Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Transparency
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={rgba.a}
                  onChange={handleAlphaChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-4 text-sm font-mono w-12 text-right">
                  {Math.round(rgba.a * 100)}%
                </span>
              </div>
            </div>

            {/* Color Format Tabs */}
            <div className="mb-6">
              <div className="flex border-b border-gray-700">
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'hex' 
                      ? 'text-blue-500 border-b-2 border-blue-500' 
                      : 'text-gray-400'
                  }`}
                  onClick={() => setActiveTab('hex')}
                >
                  HEX
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'rgb' 
                      ? 'text-blue-500 border-b-2 border-blue-500' 
                      : 'text-gray-400'
                  }`}
                  onClick={() => setActiveTab('rgb')}
                >
                  RGB
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'hsl' 
                      ? 'text-blue-500 border-b-2 border-blue-500' 
                      : 'text-gray-400'
                  }`}
                  onClick={() => setActiveTab('hsl')}
                >
                  HSL
                </button>
              </div>
              
              {/* Color Value Display */}
              <div className="mt-4 relative">
                <input
                  type="text"
                  value={getColorString()}
                  readOnly
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 font-mono text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Color Components */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-800 rounded-md p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Red</div>
                <div className="text-lg font-mono">{rgba.r}</div>
              </div>
              <div className="bg-gray-800 rounded-md p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Green</div>
                <div className="text-lg font-mono">{rgba.g}</div>
              </div>
              <div className="bg-gray-800 rounded-md p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Blue</div>
                <div className="text-lg font-mono">{rgba.b}</div>
              </div>
            </div>

            
          </div>
        </motion.div>
      </div>
    </div>
    </PrivateRoute>
  );
}