import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface RoomsStepProps {
  data: Array<{
    name: string;
    capacity: number;
  }>;
  onDataChange: (data: RoomsStepProps['data']) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export function RoomsStep({ onNext, onPrev, isLoading }: RoomsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Rooms & Venues
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add the rooms or spaces where sessions will take place.
        </p>
      </div>

      <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">
          Rooms step coming soon...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          This will allow you to add rooms with capacity and reorder them.
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
          Back to Event Details
        </Button>
        <Button 
          onClick={onNext}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          Continue to Time Blocks
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
} 