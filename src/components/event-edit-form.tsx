'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, Plus, X, GripVertical, Save } from 'lucide-react';
import { logger } from '@/lib/logger';

// Schemas
const eventDetailsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  startsAt: z.string().min(1, 'Start time is required'),
  endsAt: z.string().min(1, 'End time is required'),
}).refine((data) => {
  const start = new Date(data.startsAt);
  const end = new Date(data.endsAt);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['endsAt'],
});

type EventDetailsData = z.infer<typeof eventDetailsSchema>;

// Type definitions for form data
type RoomData = {
  id?: string;
  name: string;
  capacity: number;
  sortOrder: number;
};

type TimeBlockData = {
  id?: string;
  startsAt: string;
  endsAt: string;
  sortOrder: number;
};

interface EventEditFormProps {
  event: {
    id: string;
    title: string;
    startsAt: Date;
    endsAt: Date;
    rooms: Array<{
      id: string;
      name: string;
      capacity: number;
      sortOrder: number;
    }>;
    timeBlocks: Array<{
      id: string;
      startsAt: Date;
      endsAt: Date;
      sortOrder: number;
    }>;
  };
  onUpdate?: () => void;
}

export function EventEditForm({ event, onUpdate }: EventEditFormProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'rooms' | 'blocks'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<RoomData[]>(
    event.rooms.map(room => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      sortOrder: room.sortOrder,
    }))
  );
  const [timeBlocks, setTimeBlocks] = useState<TimeBlockData[]>(
    event.timeBlocks.map(block => ({
      id: block.id,
      startsAt: block.startsAt.toISOString().slice(0, 16),
      endsAt: block.endsAt.toISOString().slice(0, 16),
      sortOrder: block.sortOrder,
    }))
  );

  // Event details form
  const eventForm = useForm<EventDetailsData>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: {
      title: event.title,
      startsAt: event.startsAt.toISOString().slice(0, 16),
      endsAt: event.endsAt.toISOString().slice(0, 16),
    },
  });

  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  const updateEventDetails = async (data: EventDetailsData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          startsAt: new Date(data.startsAt).toISOString(),
          endsAt: new Date(data.endsAt).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      logger.info('Event details updated', { eventId: event.id });
      if (onUpdate) {
        onUpdate();
      } else {
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      logger.error('Failed to update event details', error as Error);
      alert('Failed to update event details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateRooms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${event.id}/rooms`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rooms }),
      });

      if (!response.ok) {
        throw new Error('Failed to update rooms');
      }

      logger.info('Rooms updated', { eventId: event.id, roomCount: rooms.length });
      if (onUpdate) {
        onUpdate();
      } else {
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      logger.error('Failed to update rooms', error as Error);
      alert('Failed to update rooms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTimeBlocks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${event.id}/time-blocks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeBlocks }),
      });

      if (!response.ok) {
        throw new Error('Failed to update time blocks');
      }

      logger.info('Time blocks updated', { eventId: event.id, blockCount: timeBlocks.length });
      if (onUpdate) {
        onUpdate();
      } else {
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      logger.error('Failed to update time blocks', error as Error);
      alert('Failed to update time blocks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addRoom = () => {
    const newRoom: RoomData = {
      name: `Room ${rooms.length + 1}`,
      capacity: 20,
      sortOrder: rooms.length,
    };
    setRooms([...rooms, newRoom]);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const addTimeBlock = () => {
    const lastBlock = timeBlocks[timeBlocks.length - 1];
    const startTime = lastBlock 
      ? new Date(new Date(lastBlock.endsAt).getTime() + 15 * 60000) // 15 min after last block
      : new Date(event.startsAt);
    const endTime = new Date(startTime.getTime() + 60 * 60000); // 1 hour duration

    const newBlock: TimeBlockData = {
      startsAt: formatDateTime(startTime),
      endsAt: formatDateTime(endTime),
      sortOrder: timeBlocks.length,
    };
    setTimeBlocks([...timeBlocks, newBlock]);
  };

  const removeTimeBlock = (index: number) => {
    setTimeBlocks(timeBlocks.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: 'details', label: 'Event Details', icon: Calendar },
    { id: 'rooms', label: 'Rooms', icon: MapPin },
    { id: 'blocks', label: 'Time Blocks', icon: Clock },
  ] as const;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Event Details Tab */}
          {activeTab === 'details' && (
            <form onSubmit={eventForm.handleSubmit(updateEventDetails)} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  {...eventForm.register('title')}
                  placeholder="Enter event title"
                />
                {eventForm.formState.errors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {eventForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startsAt">Start Time</Label>
                  <Input
                    id="startsAt"
                    type="datetime-local"
                    {...eventForm.register('startsAt')}
                  />
                  {eventForm.formState.errors.startsAt && (
                    <p className="text-sm text-red-600 mt-1">
                      {eventForm.formState.errors.startsAt.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="endsAt">End Time</Label>
                  <Input
                    id="endsAt"
                    type="datetime-local"
                    {...eventForm.register('endsAt')}
                  />
                  {eventForm.formState.errors.endsAt && (
                    <p className="text-sm text-red-600 mt-1">
                      {eventForm.formState.errors.endsAt.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Event Details'}
              </Button>
            </form>
          )}

          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Event Rooms</h3>
                <Button onClick={addRoom} size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Room
                </Button>
              </div>

              <div className="space-y-3">
                {rooms.map((room, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Room name"
                        value={room.name}
                        onChange={(e) => {
                          const newRooms = [...rooms];
                          if (newRooms[index]) {
                            newRooms[index].name = e.target.value;
                            setRooms(newRooms);
                          }
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Capacity"
                        value={room.capacity}
                        onChange={(e) => {
                          const newRooms = [...rooms];
                          if (newRooms[index]) {
                            newRooms[index].capacity = parseInt(e.target.value) || 0;
                            setRooms(newRooms);
                          }
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeRoom(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button onClick={updateRooms} disabled={isLoading} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Rooms'}
              </Button>
            </div>
          )}

          {/* Time Blocks Tab */}
          {activeTab === 'blocks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Time Blocks</h3>
                <Button onClick={addTimeBlock} size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Time Block
                </Button>
              </div>

              <div className="space-y-3">
                {timeBlocks.map((block, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Start Time</Label>
                        <Input
                          type="datetime-local"
                          value={block.startsAt}
                          onChange={(e) => {
                            const newBlocks = [...timeBlocks];
                            if (newBlocks[index]) {
                              newBlocks[index].startsAt = e.target.value;
                              setTimeBlocks(newBlocks);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End Time</Label>
                        <Input
                          type="datetime-local"
                          value={block.endsAt}
                          onChange={(e) => {
                            const newBlocks = [...timeBlocks];
                            if (newBlocks[index]) {
                              newBlocks[index].endsAt = e.target.value;
                              setTimeBlocks(newBlocks);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTimeBlock(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button onClick={updateTimeBlocks} disabled={isLoading} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Time Blocks'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 