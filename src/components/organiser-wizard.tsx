'use client';

import { useState, useEffect } from 'react';
import { EventDetailsStep } from './organiser-wizard/event-details-step';
import { RoomsStep } from './organiser-wizard/rooms-step';
import { TimeBlocksStep } from './organiser-wizard/time-blocks-step';
import { WizardProgress } from './organiser-wizard/wizard-progress';
import { Card, CardContent } from '@/components/ui/card';
import { QRCode } from '@/components/qr-code';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Calendar } from 'lucide-react';
import { logger } from '@/lib/logger';

export interface WizardData {
  eventDetails: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  rooms: Array<{
    name: string;
    capacity: number;
  }>;
  timeBlocks: Array<{
    startTime: string;
    endTime: string;
  }>;
}

// Generate default event details with tomorrow's date and sensible times
const getDefaultEventDetails = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return {
    title: '',
    date: tomorrow.toISOString().split('T')[0] || '', // Format as YYYY-MM-DD, fallback to empty string
    startTime: '09:00',
    endTime: '17:00',
  };
};

const INITIAL_WIZARD_DATA: WizardData = {
  eventDetails: getDefaultEventDetails(),
  rooms: [],
  timeBlocks: [],
};

export function OrganiserWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(INITIAL_WIZARD_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [eventResult, setEventResult] = useState<{
    id: string;
    shortId: string;
    title: string;
    accessUrl: string;
  } | null>(null);

  // Load saved wizard data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('organiser-wizard-draft');
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Merge saved data with defaults to ensure all fields have values
        const savedWizardData = parsedData.wizardData || {};
        const mergedData: WizardData = {
          eventDetails: {
            ...getDefaultEventDetails(),
            ...savedWizardData.eventDetails,
          },
          rooms: savedWizardData.rooms || [],
          timeBlocks: savedWizardData.timeBlocks || [],
        };
        setWizardData(mergedData);
        setCurrentStep(parsedData.currentStep || 1);
        logger.info('Loaded wizard draft from localStorage', {
          component: 'organiser-wizard',
          step: parsedData.currentStep,
        });
      }
    } catch (error) {
      logger.error('Failed to load wizard draft from localStorage', error as Error, {
        component: 'organiser-wizard',
      });
    }
  }, []);

  // Auto-save wizard data to localStorage
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('organiser-wizard-draft', JSON.stringify({
          wizardData,
          currentStep,
          lastSaved: new Date().toISOString(),
        }));
        logger.debug('Auto-saved wizard draft', {
          component: 'organiser-wizard',
          step: currentStep,
        });
      } catch (error) {
        logger.error('Failed to save wizard draft to localStorage', error as Error, {
          component: 'organiser-wizard',
        });
      }
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(saveTimeout);
  }, [wizardData, currentStep]);

  const updateWizardData = (stepData: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('organiser-wizard-draft');
    setWizardData(INITIAL_WIZARD_DATA);
    setCurrentStep(1);
  };

  const createEvent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: wizardData.eventDetails.title,
          date: wizardData.eventDetails.date,
          startTime: wizardData.eventDetails.startTime,
          endTime: wizardData.eventDetails.endTime,
          rooms: wizardData.rooms,
          timeBlocks: wizardData.timeBlocks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const result = await response.json();
      
      if (result.success) {
        setEventResult(result.event);
        setIsCompleted(true);
        clearDraft();
        logger.info('Event created successfully', {
          component: 'organiser-wizard',
          eventId: result.event.id,
          shortId: result.event.shortId,
        });
      } else {
        throw new Error(result.error || 'Failed to create event');
      }
    } catch (error) {
      logger.error('Failed to create event', error as Error, {
        component: 'organiser-wizard',
      });
      // TODO: Show error toast
      alert('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewEvent = () => {
    setIsCompleted(false);
    setEventResult(null);
    setWizardData(INITIAL_WIZARD_DATA);
    setCurrentStep(1);
  };

  // Show completion screen with QR code
  if (isCompleted && eventResult) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              🎉 Event Created Successfully!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Your unconference &ldquo;<strong>{eventResult.title}</strong>&rdquo; is ready to go
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* QR Code */}
          <div className="flex justify-center">
            <QRCode
              value={eventResult.accessUrl}
              title={eventResult.title}
              size={250}
            />
          </div>

          {/* Event Details & Next Steps */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5" />
                    Next Steps
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        1. Share the QR code
                      </p>
                      <p className="text-blue-700 dark:text-blue-300 mt-1">
                        Print or display the QR code so attendees can scan and join instantly
                      </p>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="font-medium text-green-900 dark:text-green-100">
                        2. Start topic collection
                      </p>
                      <p className="text-green-700 dark:text-green-300 mt-1">
                        Attendees can now submit their interests and propose session topics
                      </p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <p className="font-medium text-purple-900 dark:text-purple-100">
                        3. Monitor and moderate
                      </p>
                      <p className="text-purple-700 dark:text-purple-300 mt-1">
                        Watch the voting board and remove duplicate topics as needed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Event ID:</p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {eventResult.shortId}
                    </code>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Access URL:</p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded break-all">
                      {typeof window !== 'undefined' ? `${window.location.origin}${eventResult.accessUrl}` : eventResult.accessUrl}
                    </code>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={startNewEvent}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Create Another Event
                  </Button>
                  
                  <Button
                    onClick={() => window.open(eventResult.accessUrl, '_blank')}
                    className="flex items-center gap-2"
                  >
                    View Event Page
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WizardProgress currentStep={currentStep} totalSteps={3} />
      
      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && (
            <EventDetailsStep
              data={wizardData.eventDetails}
              onDataChange={(eventDetails: WizardData['eventDetails']) => updateWizardData({ eventDetails })}
              onNext={nextStep}
              isLoading={isLoading}
            />
          )}
          
          {currentStep === 2 && (
            <RoomsStep
              data={wizardData.rooms}
              onDataChange={(rooms: WizardData['rooms']) => updateWizardData({ rooms })}
              onNext={nextStep}
              onPrev={prevStep}
              isLoading={isLoading}
            />
          )}
          
          {currentStep === 3 && (
            <TimeBlocksStep
              data={wizardData.timeBlocks}
              onDataChange={(timeBlocks: WizardData['timeBlocks']) => updateWizardData({ timeBlocks })}
              onPrev={prevStep}
              onComplete={createEvent}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 