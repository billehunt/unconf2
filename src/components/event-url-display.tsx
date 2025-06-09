'use client';

import { useEffect, useState } from 'react';

interface EventUrlDisplayProps {
  eventUrl: string;
}

export function EventUrlDisplay({ eventUrl }: EventUrlDisplayProps) {
  const [fullUrl, setFullUrl] = useState<string>(eventUrl); // Start with relative path
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setFullUrl(`${window.location.origin}${eventUrl}`);
    }
  }, [eventUrl]);

  return (
    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
      <code 
        className="text-sm break-all block text-gray-900 dark:text-gray-100"
        suppressHydrationWarning
      >
        {fullUrl}
      </code>
      {!mounted && (
        <p className="text-xs text-gray-500 mt-1">
          Loading full URL...
        </p>
      )}
    </div>
  );
} 