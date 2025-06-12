"use client";
import PrivateRoute from "@/components/PrivateRoute";

import React, { useState, useRef } from 'react';
import QRCode from "react-qr-code";
import { motion } from 'framer-motion';

const QRCodeGenerator = () => {
  // State for URL input and QR code customization
  const [url, setUrl] = useState('');
  const [qrValue, setQrValue] = useState('https://example.com');
  const [qrSize, setQrSize] = useState(256);
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Reference to QR code container for downloading
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Generate QR code from input URL
  const generateQRCode = () => {
    if (!url) {
      alert('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      setQrValue(formattedUrl);
      setIsGenerated(true);
    } catch  {
      alert('Please enter a valid URL');
    }
  };

  // Handle keyboard enter to generate QR code
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      generateQRCode();
    }
  };

  // Share QR code using Web Share API
  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code',
          text: `QR Code for: ${qrValue}`,
          url: qrValue,
        });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(qrValue);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Download QR code as PNG
  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;
    
    const svg = qrCodeRef.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    const img = new Image();
    if (!ctx) return;
    img.onload = () => {
      canvas.width = qrSize;
      canvas.height = qrSize;
      ctx.fillStyle = qrBgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${new Date().getTime()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <PrivateRoute>
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto py-12 px-4">
        <motion.div 
          className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <motion.div 
              className="text-blue-400 text-4xl mr-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold">QR Code Generator</h1>
              <p className="text-gray-400">Create, customize, and share QR codes for your links</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Input section */}
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Enter URL or text</label>
                <div className="flex">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://example.com"
                    className="flex-grow p-3 rounded-l-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <motion.button
                    onClick={generateQRCode}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Generate
                  </motion.button>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-300">Customize QR Code</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Size</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="128"
                      max="512"
                      step="16"
                      value={qrSize}
                      onChange={(e) => setQrSize(parseInt(e.target.value))}
                      className="w-full mr-3"
                    />
                    <span className="text-gray-400">{qrSize}px</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">QR Color</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="p-1 bg-transparent border-0 rounded"
                    />
                    <span className="ml-2 text-gray-400">{qrColor}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Background Color</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="p-1 bg-transparent border-0 rounded"
                    />
                    <span className="ml-2 text-gray-400">{qrBgColor}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-2 text-gray-300">Tips</h3>
                <ul className="text-gray-400 space-y-2 text-sm list-disc pl-5">
                  <li>For websites, include https:// for proper scanning</li>
                  <li>Keep QR codes simple for better scanning</li>
                  <li>Test your QR code with different devices</li>
                  <li>Use high contrast colors for better readability</li>
                </ul>
              </div>
            </motion.div>

            {/* QR Code display section */}
            <motion.div 
              className="lg:w-1/2 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div 
                ref={qrCodeRef}
                className="mb-6 p-8 bg-white rounded-lg flex items-center justify-center"
                style={{ backgroundColor: qrBgColor }}
              >
                <QRCode
                  size={qrSize}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={qrValue}
                  viewBox={`0 0 ${qrSize} ${qrSize}`}
                  fgColor={qrColor}
                  bgColor={qrBgColor}
                />
              </div>
              
              <p className="text-center text-gray-400 mb-4 text-sm break-all px-4">
                {isGenerated ? `QR Code for: ${qrValue}` : 'Enter a URL and click Generate'}
              </p>
              
              <div className="flex space-x-3">
                <motion.button
                  onClick={downloadQRCode}
                  disabled={!isGenerated}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isGenerated ? 'bg-green-700 hover:bg-green-600' : 'bg-gray-700 cursor-not-allowed'}`}
                  whileHover={isGenerated ? { scale: 1.05 } : {}}
                  whileTap={isGenerated ? { scale: 0.95 } : {}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </motion.button>
                
                <motion.button
                  onClick={shareQRCode}
                  disabled={!isGenerated}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isGenerated ? 'bg-blue-700 hover:bg-blue-600' : 'bg-gray-700 cursor-not-allowed'}`}
                  whileHover={isGenerated ? { scale: 1.05 } : {}}
                  whileTap={isGenerated ? { scale: 0.95 } : {}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {isCopied ? 'Copied!' : isShared ? 'Shared!' : 'Share'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
    </PrivateRoute>
  );
};

export default QRCodeGenerator;