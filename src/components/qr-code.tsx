'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Download, Check, QrCode } from 'lucide-react';
import { logger } from '@/lib/logger';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  title?: string;
  className?: string;
}

export function QRCode({ value, size = 200, title, className = '' }: QRCodeProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Generate the full URL for the QR code
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${value}` : value;
  
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsLoading(true);
        
        // Generate QR code as data URL for display
        const dataURL = await QRCodeLib.toDataURL(fullUrl, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        
        setQrCodeDataURL(dataURL);
        
        // Also draw on canvas for PNG download
        if (canvasRef.current) {
          await QRCodeLib.toCanvas(canvasRef.current, fullUrl, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
          });
        }
        
        logger.debug('QR code generated successfully', {
          component: 'qr-code',
          url: fullUrl,
          size,
        });
      } catch (error) {
        logger.error('Failed to generate QR code', error as Error, {
          component: 'qr-code',
          url: fullUrl,
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateQRCode();
  }, [fullUrl, size]);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      logger.debug('Link copied to clipboard', {
        component: 'qr-code',
        url: fullUrl,
      });
    } catch (error) {
      logger.error('Failed to copy to clipboard', error as Error, {
        component: 'qr-code',
      });
    }
  };
  
  const downloadPNG = () => {
    try {
      if (!canvasRef.current) {
        throw new Error('Canvas not available');
      }
      
      // Convert canvas to blob and download
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `qr-code-${title || 'event'}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
      
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
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white">
              {isLoading ? (
                <div 
                  className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded"
                  style={{ width: size, height: size }}
                >
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    Generating QR...
                  </div>
                </div>
              ) : qrCodeDataURL ? (
                <img 
                  src={qrCodeDataURL} 
                  alt={`QR Code for ${title || 'event'}`}
                  width={size}
                  height={size}
                  className="block"
                />
              ) : (
                <div 
                  className="flex items-center justify-center bg-red-100 dark:bg-red-900 rounded"
                  style={{ width: size, height: size }}
                >
                  <div className="text-red-600 dark:text-red-400 text-sm text-center">
                    Failed to generate QR code
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Hidden canvas for PNG download */}
          <canvas 
            ref={canvasRef} 
            style={{ display: 'none' }}
            width={size}
            height={size}
          />
          
          {/* Event URL */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Event URL:</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded break-all">
              {fullUrl}
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
              disabled={isLoading || !qrCodeDataURL}
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