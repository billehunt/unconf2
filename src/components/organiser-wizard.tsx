'use client';

import { useState, useEffect } from 'react';
import { EventDetailsStep } from './organiser-wizard/event-details-step';
import { RoomsStep } from './organiser-wizard/rooms-step';
import { TimeBlocksStep } from './organiser-wizard/time-blocks-step';
import { WizardProgress } from './organiser-wizard/wizard-progress';
import { Card, CardContent } from '@/components/ui/card';
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

const INITIAL_WIZARD_DATA: WizardData = {
  eventDetails: {
    title: '',
    date: '',
    startTime: '',
    endTime: '',
  },
  rooms: [],
  timeBlocks: [],
};

export function OrganiserWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(INITIAL_WIZARD_DATA);
  const [isLoading] = useState(false);

  // Load saved wizard data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('organiser-wizard-draft');
      if (saved) {
        const parsedData = JSON.parse(saved);
        setWizardData(parsedData.wizardData || INITIAL_WIZARD_DATA);
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
              onComplete={() => {
                // Handle wizard completion
                logger.info('Wizard completed', { wizardData });
                clearDraft();
              }}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 