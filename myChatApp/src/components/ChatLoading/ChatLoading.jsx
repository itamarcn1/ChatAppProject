import React from 'react';
import { Stack, Skeleton } from '@mui/material';

export const ChatLoading = () => {
  return (
    <Stack spacing={1}>
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" width="60%" height={20} />
      <Skeleton variant="text" width="70%" height={20} />
      <Skeleton variant="text" width="90%" height={20} />
      <Skeleton variant="text" width="50%" height={20} />
    </Stack>
  );
};
