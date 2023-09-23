import { enqueueSnackbar } from 'notistack';

type ReportErrorParams = {
  error: unknown;
  prefix?: string;
  notice?: boolean;
};

export const reportError = ({ error, prefix, notice = false }: ReportErrorParams) => {
  if (error instanceof Error) {
    console.error(prefix, error.message);
  } else {
    console.error(prefix, JSON.stringify(error));
  }

  if (notice) {
    enqueueSnackbar('Something Wrong... Retry', { variant: 'error' });
  }
};
