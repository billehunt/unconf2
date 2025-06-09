'use client';

import { useEffect, useState } from 'react';

interface EventUrlDisplayProps {
  eventUrl: string;
}

export function EventUrlDisplay({ eventUrl }: EventUrlDisplayProps) {
  const [fullUrl, setFullUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(`${window.location.origin}${eventUrl}`);
    }
  }, [eventUrl]);

  if (!fullUrl) {
    return (
      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
        <code className="text-sm break-all block text-gray-500">
          Loading full URL...
        </code>
      </div>
    );
  }

  return (
    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
      <code className="text-sm break-all block text-gray-900 dark:text-gray-100">
        {fullUrl}
      </code>
    </div>
  );
} 