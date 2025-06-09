'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Check, Plus, Trash2, GripVertical, Clock, AlertTriangle } from 'lucide-react';
import { logger } from '@/lib/logger';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const timeBlockSchema = z.object({
  startTime: z.string()
    .min(1, 'Start time is required')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'),
  endTime: z.string()
    .min(1, 'End time is required')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'),
}).refine((data) => {
  if (data.startTime && data.endTime) {
    const start = new Date(`2000-01-01T${data.startTime}`);
    const end = new Date(`2000-01-01T${data.endTime}`);
    return end > start;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

const timeBlocksSchema = z.object({
  timeBlocks: z.array(timeBlockSchema)
    .min(1, 'At least one time block is required')
    .max(12, 'Maximum 12 time blocks allowed'),
});

type TimeBlocksForm = z.infer<typeof timeBlocksSchema>;

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

interface SortableTimeBlockItemProps {
  index: number;
  register: ReturnType<typeof useForm<TimeBlocksForm>>['register'];
  errors: ReturnType<typeof useForm<TimeBlocksForm>>['formState']['errors'];
  onRemove: (index: number) => void;
  canRemove: boolean;
  isDragEnabled?: boolean;
  duration: string;
  hasConflict: boolean;
  conflictMessage?: string;
}

function SortableTimeBlockItem({ 
  index, 
  register, 
  errors, 
  onRemove, 
  canRemove, 
  isDragEnabled = true,
  duration,
  hasConflict,
  conflictMessage
}: SortableTimeBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: `timeblock-${index}`,
    disabled: !isDragEnabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`transition-all ${isDragging ? 'shadow-lg z-10' : ''} ${
        hasConflict ? 'border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800' : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          {isDragEnabled ? (
            <div
              {...attributes}
              {...listeners}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
              tabIndex={0}
              aria-label={`Drag to reorder time block ${index + 1}`}
            >
              <GripVertical className="w-4 h-4" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-8 h-8 text-gray-300">
              <GripVertical className="w-4 h-4" />
            </div>
          )}

          {/* Time Block Fields */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Time */}
              <div className="space-y-2">
                <Label htmlFor={`timeBlocks.${index}.startTime`} className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Start Time
                </Label>
                <Input
                  id={`timeBlocks.${index}.startTime`}
                  type="time"
                  {...register(`timeBlocks.${index}.startTime`)}
                  className={errors.timeBlocks?.[index]?.startTime || hasConflict ? 'border-red-500' : ''}
                />
                {errors.timeBlocks?.[index]?.startTime && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.timeBlocks[index].startTime.message}
                  </p>
                )}
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <Label htmlFor={`timeBlocks.${index}.endTime`} className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  End Time
                </Label>
                <Input
                  id={`timeBlocks.${index}.endTime`}
                  type="time"
                  {...register(`timeBlocks.${index}.endTime`)}
                  className={errors.timeBlocks?.[index]?.endTime || hasConflict ? 'border-red-500' : ''}
                />
                {errors.timeBlocks?.[index]?.endTime && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.timeBlocks[index].endTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Duration and Conflict Info */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Time Block {index + 1}</span>
                {duration && (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Duration: {duration}
                  </span>
                )}
              </div>
              
              {hasConflict && (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">{conflictMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRemove(index)}
            disabled={!canRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            aria-label={`Remove time block ${index + 1}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to calculate duration
function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return '';
  
  try {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (end <= start) return '';
    
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours === 0) {
      return `${diffMinutes}min`;
    } else if (diffMinutes === 0) {
      return `${diffHours}h`;
    } else {
      return `${diffHours}h ${diffMinutes}min`;
    }
  } catch {
    return '';
  }
}

// Helper function to detect conflicts
function detectConflicts(timeBlocks: Array<{ startTime: string; endTime: string }>) {
  const conflicts: Array<{ hasConflict: boolean; message?: string }> = timeBlocks.map(() => ({ hasConflict: false }));
  
  for (let i = 0; i < timeBlocks.length; i++) {
    for (let j = i + 1; j < timeBlocks.length; j++) {
      const block1 = timeBlocks[i];
      const block2 = timeBlocks[j];
      
      // Skip if blocks don't exist or are incomplete
      if (!block1?.startTime || !block1?.endTime || !block2?.startTime || !block2?.endTime) {
        continue;
      }
      
      try {
        const start1 = new Date(`2000-01-01T${block1.startTime}`);
        const end1 = new Date(`2000-01-01T${block1.endTime}`);
        const start2 = new Date(`2000-01-01T${block2.startTime}`);
        const end2 = new Date(`2000-01-01T${block2.endTime}`);
        
        // Check for overlap
        if ((start1 < end2 && end1 > start2)) {
          conflicts[i] = { hasConflict: true, message: `Overlaps with Block ${j + 1}` };
          conflicts[j] = { hasConflict: true, message: `Overlaps with Block ${i + 1}` };
        }
      } catch {
        // Ignore parsing errors
      }
    }
  }
  
  return conflicts;
}

export function TimeBlocksStep({ data, onDataChange, onPrev, onComplete, isLoading }: TimeBlocksStepProps) {
  const [mounted, setMounted] = useState(false);
  
  const form = useForm<TimeBlocksForm>({
    resolver: zodResolver(timeBlocksSchema),
    defaultValues: {
      timeBlocks: data.length > 0 ? data : [{ startTime: '09:00', endTime: '10:30' }], // Default with one block
    },
    mode: 'onChange',
  });

  const { register, handleSubmit, formState: { errors, isValid }, control, watch } = form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'timeBlocks',
  });

  // Watch form values for auto-saving
  const watchedValues = watch();

  // Set mounted state after component mounts to prevent SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-save form data when values change
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (watchedValues.timeBlocks) {
        // Filter out incomplete time blocks for saving
        const validTimeBlocks = watchedValues.timeBlocks.filter(block => 
          block.startTime && block.endTime && 
          block.startTime.trim().length > 0 && block.endTime.trim().length > 0
        );
        onDataChange(validTimeBlocks);
        logger.debug('Auto-saved time blocks data', {
          component: 'time-blocks-step',
          data: validTimeBlocks,
        });
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [watchedValues, onDataChange]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(field => `timeblock-${fields.indexOf(field)}` === active.id);
      const newIndex = fields.findIndex(field => `timeblock-${fields.indexOf(field)}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
        logger.debug('Reordered time blocks', {
          component: 'time-blocks-step',
          from: oldIndex,
          to: newIndex,
        });
      }
    }
  };

  const addTimeBlock = () => {
    if (fields.length < 12) {
      // Auto-suggest next time based on last block
      let startTime = '09:00';
      let endTime = '10:30';
      
      if (fields.length > 0) {
        const lastBlock = watchedValues.timeBlocks[fields.length - 1];
        if (lastBlock?.endTime) {
          startTime = lastBlock.endTime;
          // Add 1.5 hours by default
          try {
            const start = new Date(`2000-01-01T${startTime}`);
            const end = new Date(start.getTime() + 90 * 60 * 1000); // 90 minutes
            endTime = end.toTimeString().slice(0, 5);
          } catch {
            endTime = '10:30';
          }
        }
      }
      
      append({ startTime, endTime });
      logger.debug('Added new time block', { component: 'time-blocks-step' });
    }
  };

  const removeTimeBlock = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      logger.debug('Removed time block', { component: 'time-blocks-step', index });
    }
  };

  const onSubmit = (formData: TimeBlocksForm) => {
    logger.info('Time blocks form submitted', {
      component: 'time-blocks-step',
      data: formData.timeBlocks,
    });
    onDataChange(formData.timeBlocks);
    onComplete();
  };

  // Calculate durations and conflicts for each time block
  const blockInfo = watchedValues.timeBlocks?.map((block) => ({
    duration: calculateDuration(block.startTime, block.endTime),
  })) || [];

  const conflicts = detectConflicts(watchedValues.timeBlocks || []);
  const hasAnyConflicts = conflicts.some(c => c.hasConflict);

  const getTimeSuggestions = () => [
    { label: 'Morning Session', startTime: '09:00', endTime: '10:30' },
    { label: 'Late Morning', startTime: '10:45', endTime: '12:15' },
    { label: 'Afternoon Session', startTime: '13:30', endTime: '15:00' },
    { label: 'Late Afternoon', startTime: '15:15', endTime: '16:45' },
    { label: 'Evening Session', startTime: '18:00', endTime: '19:30' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Time Blocks
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Define the time slots when sessions can be scheduled. You can drag to reorder them.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Time Blocks List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">
              Time Blocks ({fields.length})
              {hasAnyConflicts && (
                <span className="ml-2 text-red-600 dark:text-red-400 text-sm font-normal">
                  ⚠️ Conflicts detected
                </span>
              )}
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTimeBlock}
              disabled={fields.length >= 12 || isLoading}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Time Block
            </Button>
          </div>

          {mounted ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((_, index) => `timeblock-${index}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <SortableTimeBlockItem
                      key={field.id}
                      index={index}
                      register={register}
                      errors={errors}
                      onRemove={removeTimeBlock}
                      canRemove={fields.length > 1}
                      isDragEnabled={true}
                      duration={blockInfo[index]?.duration || ''}
                      hasConflict={conflicts[index]?.hasConflict || false}
                      conflictMessage={conflicts[index]?.message}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <SortableTimeBlockItem
                  key={field.id}
                  index={index}
                  register={register}
                  errors={errors}
                  onRemove={removeTimeBlock}
                  canRemove={fields.length > 1}
                  isDragEnabled={false}
                  duration={blockInfo[index]?.duration || ''}
                  hasConflict={conflicts[index]?.hasConflict || false}
                  conflictMessage={conflicts[index]?.message}
                />
              ))}
            </div>
          )}

          {errors.timeBlocks && typeof errors.timeBlocks.message === 'string' && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.timeBlocks.message}</p>
          )}
        </div>

        {/* Time Block Suggestions */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            💡 Common time slots for unconferences:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
            {getTimeSuggestions().map((suggestion, index) => (
              <div key={index} className="flex justify-between">
                <span>{suggestion.label}</span>
                <span>{suggestion.startTime} - {suggestion.endTime} ({calculateDuration(suggestion.startTime, suggestion.endTime)})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-save indicator */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          ✓ Changes are automatically saved as you type
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button 
            type="button"
            variant="outline" 
            onClick={onPrev}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rooms
          </Button>
          <Button 
            type="submit"
            disabled={!isValid || hasAnyConflicts || isLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4" />
            Complete Setup
          </Button>
        </div>
      </form>
    </div>
  );
} 