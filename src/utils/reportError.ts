export const reportError = (error: unknown, prefix?: string) => {
  if (error instanceof Error) {
    console.error(prefix, error.message);
  } else {
    console.error(prefix, JSON.stringify(error));
  }
};
