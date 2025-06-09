import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

interface TimeBlocksStepProps {
  data: Array<{
    startTime: string;
    endTime: string;
  }>;
  onDataChange: (data: TimeBlocksStepProps['data']) => void;
  onPrev: () => void;
  onComplete: () => void;
  isLoading: boolean;
}

export function TimeBlocksStep({ onPrev, onComplete, isLoading }: TimeBlocksStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Time Blocks
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Define the time slots when sessions can be scheduled.
        </p>
      </div>

      <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">
          Time blocks step coming soon...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          This will allow you to create time ranges with conflict detection.
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onPrev}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Rooms
        </Button>
        <Button 
          onClick={onComplete}
          disabled={isLoading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Check className="w-4 h-4" />
          Complete Setup
        </Button>
      </div>
    </div>
  );
} 