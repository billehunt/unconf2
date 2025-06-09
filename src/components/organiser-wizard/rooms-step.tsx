'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Plus, Trash2, GripVertical, MapPin, Users } from 'lucide-react';
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

const roomSchema = z.object({
  name: z.string()
    .min(1, 'Room name is required')
    .max(50, 'Room name must be less than 50 characters'),
  capacity: z.number()
    .min(1, 'Capacity must be at least 1')
    .max(1000, 'Capacity must be less than 1000'),
});

const roomsSchema = z.object({
  rooms: z.array(roomSchema)
    .min(1, 'At least one room is required')
    .max(10, 'Maximum 10 rooms allowed'),
});

type RoomsForm = z.infer<typeof roomsSchema>;

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

interface SortableRoomItemProps {
  index: number;
  register: ReturnType<typeof useForm<RoomsForm>>['register'];
  errors: ReturnType<typeof useForm<RoomsForm>>['formState']['errors'];
  onRemove: (index: number) => void;
  canRemove: boolean;
  isDragEnabled?: boolean;
}

function SortableRoomItem({ index, register, errors, onRemove, canRemove, isDragEnabled = true }: SortableRoomItemProps) {
  // Always call the hook, but conditionally use its functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: `room-${index}`,
    disabled: !isDragEnabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className={`transition-all ${isDragging ? 'shadow-lg z-10' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          {isDragEnabled ? (
            <div
              {...attributes}
              {...listeners}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
              tabIndex={0}
              aria-label={`Drag to reorder room ${index + 1}`}
            >
              <GripVertical className="w-4 h-4" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-8 h-8 text-gray-300">
              <GripVertical className="w-4 h-4" />
            </div>
          )}

          {/* Room Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Room Name */}
            <div className="space-y-2">
              <Label htmlFor={`rooms.${index}.name`} className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Room Name
              </Label>
              <Input
                id={`rooms.${index}.name`}
                {...register(`rooms.${index}.name`)}
                placeholder="e.g., Conference Room A"
                className={errors.rooms?.[index]?.name ? 'border-red-500' : ''}
              />
              {errors.rooms?.[index]?.name && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.rooms[index].name.message}
                </p>
              )}
            </div>

            {/* Room Capacity */}
            <div className="space-y-2">
              <Label htmlFor={`rooms.${index}.capacity`} className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Capacity
              </Label>
              <Input
                id={`rooms.${index}.capacity`}
                type="number"
                min="1"
                max="1000"
                {...register(`rooms.${index}.capacity`, { 
                  valueAsNumber: true,
                  setValueAs: (value: string) => value === '' ? undefined : parseInt(value, 10)
                })}
                placeholder="e.g., 20"
                className={errors.rooms?.[index]?.capacity ? 'border-red-500' : ''}
              />
              {errors.rooms?.[index]?.capacity && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.rooms[index].capacity.message}
                </p>
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
            aria-label={`Remove room ${index + 1}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Room Index Indicator */}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Room {index + 1}
        </div>
      </CardContent>
    </Card>
  );
}

export function RoomsStep({ data, onDataChange, onNext, onPrev, isLoading }: RoomsStepProps) {
  const [mounted, setMounted] = useState(false);
  
  const form = useForm<RoomsForm>({
    resolver: zodResolver(roomsSchema),
    defaultValues: {
      rooms: data.length > 0 ? data : [{ name: '', capacity: 20 }], // Default with one room
    },
    mode: 'onChange',
  });

  const { register, handleSubmit, formState: { errors, isValid }, control, watch } = form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'rooms',
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
      if (watchedValues.rooms) {
        // Filter out empty rooms for saving
        const validRooms = watchedValues.rooms.filter(room => 
          room.name && room.name.trim().length > 0 && room.capacity && room.capacity > 0
        );
        onDataChange(validRooms);
        logger.debug('Auto-saved rooms data', {
          component: 'rooms-step',
          data: validRooms,
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
      const oldIndex = fields.findIndex(field => `room-${fields.indexOf(field)}` === active.id);
      const newIndex = fields.findIndex(field => `room-${fields.indexOf(field)}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
        logger.debug('Reordered rooms', {
          component: 'rooms-step',
          from: oldIndex,
          to: newIndex,
        });
      }
    }
  };

  const addRoom = () => {
    if (fields.length < 10) {
      append({ name: '', capacity: 20 });
      logger.debug('Added new room', { component: 'rooms-step' });
    }
  };

  const removeRoom = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      logger.debug('Removed room', { component: 'rooms-step', index });
    }
  };

  const onSubmit = (formData: RoomsForm) => {
    logger.info('Rooms form submitted', {
      component: 'rooms-step',
      data: formData.rooms,
    });
    onDataChange(formData.rooms);
    onNext();
  };

  const getRoomSuggestions = () => [
    { name: 'Main Conference Room', capacity: 50 },
    { name: 'Breakout Room A', capacity: 15 },
    { name: 'Breakout Room B', capacity: 15 },
    { name: 'Workshop Space', capacity: 25 },
    { name: 'Presentation Room', capacity: 30 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Rooms & Venues
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add the rooms or spaces where sessions will take place. You can drag to reorder them.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rooms List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Rooms ({fields.length})</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRoom}
              disabled={fields.length >= 10 || isLoading}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Room
            </Button>
          </div>

                     {mounted ? (
             <DndContext
               sensors={sensors}
               collisionDetection={closestCenter}
               onDragEnd={handleDragEnd}
             >
               <SortableContext
                 items={fields.map((_, index) => `room-${index}`)}
                 strategy={verticalListSortingStrategy}
               >
                 <div className="space-y-3">
                   {fields.map((field, index) => (
                     <SortableRoomItem
                       key={field.id}
                       index={index}
                       register={register}
                       errors={errors}
                       onRemove={removeRoom}
                       canRemove={fields.length > 1}
                       isDragEnabled={true}
                     />
                   ))}
                 </div>
               </SortableContext>
             </DndContext>
           ) : (
             <div className="space-y-3">
               {fields.map((field, index) => (
                 <SortableRoomItem
                   key={field.id}
                   index={index}
                   register={register}
                   errors={errors}
                   onRemove={removeRoom}
                   canRemove={fields.length > 1}
                   isDragEnabled={false}
                 />
               ))}
             </div>
           )}

          {errors.rooms && typeof errors.rooms.message === 'string' && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.rooms.message}</p>
          )}
        </div>

        {/* Room Suggestions */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            💡 Common room types for unconferences:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
            {getRoomSuggestions().map((suggestion, index) => (
              <div key={index} className="flex justify-between">
                <span>{suggestion.name}</span>
                <span>{suggestion.capacity} people</span>
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
            Back to Event Details
          </Button>
          <Button 
            type="submit"
            disabled={!isValid || isLoading}
            className="flex items-center gap-2"
          >
            Continue to Time Blocks
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
} 