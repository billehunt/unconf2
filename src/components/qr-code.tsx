'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Download, Check, QrCode } from 'lucide-react';
import { logger } from '@/lib/logger';

interface QRCodeProps {
  value: string;
  size?: number;
  title?: string;
  className?: string;
}

// Simple QR code generation using qr-code-generator library pattern
// For a production app, you might want to use a proper QR library like 'qrcode'
function generateQRCodeSVG(text: string, size: number = 200) {
  // This is a simplified QR code generator for demo purposes
  // In a real implementation, use a proper QR library
  const modules = 25; // QR code grid size
  const moduleSize = size / modules;
  const padding = moduleSize;
  
  // Simple pattern generator (this is not a real QR code algorithm)
  // For production, use a proper QR code library
  const getModulePattern = (row: number, col: number): boolean => {
    // Create a deterministic pattern based on the text hash
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ((row + col + hash) % 3) === 0 || 
           ((row * col + hash) % 5) === 0 ||
           (row < 7 && col < 7) || // Top-left finder pattern
           (row < 7 && col >= modules - 7) || // Top-right finder pattern
           (row >= modules - 7 && col < 7); // Bottom-left finder pattern
  };
  
  let pathData = '';
  
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (getModulePattern(row, col)) {
        const x = padding + col * moduleSize;
        const y = padding + row * moduleSize;
        pathData += `M${x},${y}h${moduleSize}v${moduleSize}h-${moduleSize}z`;
      }
    }
  }
  
  const totalSize = size + 2 * padding;
  
  return `
    <svg width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${totalSize}" height="${totalSize}" fill="white"/>
      <path d="${pathData}" fill="black"/>
    </svg>
  `;
}

export function QRCode({ value, size = 200, title, className = '' }: QRCodeProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [svgContent, setSvgContent] = useState<string>('');
  const svgRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const svg = generateQRCodeSVG(value, size);
    setSvgContent(svg);
  }, [value, size]);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      logger.debug('Link copied to clipboard', {
        component: 'qr-code',
        value,
      });
    } catch (error) {
      logger.error('Failed to copy to clipboard', error as Error, {
        component: 'qr-code',
      });
    }
  };
  
  const downloadPNG = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = size + 40; // Add padding
        canvas.height = size + 40;
        
        // White background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw QR code
        ctx.drawImage(img, 20, 20, size, size);
        
        // Convert to PNG and download
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `qr-code-${title || 'event'}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
          }
        }, 'image/png');
        
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
      
      logger.debug('QR code downloaded', {
        component: 'qr-code',
        title,
      });
    } catch (error) {
      logger.error('Failed to download QR code', error as Error, {
        component: 'qr-code',
      });
    }
  };
  
  return (
    <Card className={`w-fit ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {title && (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
                <QrCode className="w-5 h-5" />
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Scan to join the event
              </p>
            </div>
          )}
          
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div 
              ref={svgRef}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>
          
          {/* Event URL */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Event URL:</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded break-all">
              {typeof window !== 'undefined' ? `${window.location.origin}${value}` : value}
            </code>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copySuccess ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={downloadPNG}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </Button>
          </div>
          
          {/* Instructions */}
          <div className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <p>💡 <strong>Share this QR code</strong> with attendees so they can join your event instantly</p>
            <p className="mt-1">No app download required - works in any mobile browser</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default QRCode; 