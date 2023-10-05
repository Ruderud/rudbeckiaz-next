'use client';

import { Button } from '@/components/Ui/Button';

export const UserSectionSkeleton = () => {
  return (
    <div className="flex justify-between bg-slate-700 bg-opacity-50 p-4">
      <header className="flex gap-4 items-baseline">
        <span className="text-2xl font-bold">USER SETTINGS</span>
        <span role="status" className="animate-pulse bg-gray-200 rounded dark:bg-gray-700 w-48 h-4"></span>
      </header>

      <Button variant="secondary" className="text-md font-bold" disabled>
        Change UserName
      </Button>
    </div>
  );
};
