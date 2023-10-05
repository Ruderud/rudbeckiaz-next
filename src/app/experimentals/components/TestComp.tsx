import { headers } from 'next/headers';

export const TestComp = () => {
  const headersList = headers();

  return <div>{JSON.stringify(headersList)}</div>;
};
