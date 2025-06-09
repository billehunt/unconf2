import { OrganiserWizard } from '@/components/organiser-wizard';

export default function OrganiserPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Create Your Unconference Event
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Set up your event in 3 simple steps. We&apos;ll save your progress automatically.
        </p>
      </div>
      
      <OrganiserWizard />
    </div>
  );
} 