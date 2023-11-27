'use client';

import { Button } from '@/components/Ui/Button';

const ErrorView = () => {
  return (
    <div>
      <div>Something wrong... </div>
      <div>Maybe it has been deleted.</div>

      <Button
        variant="secondary"
        onClick={() => {
          location.href = '/experimentals';
        }}
      >
        Go back
      </Button>
    </div>
  );
};

export { ErrorView };
