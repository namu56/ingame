import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';

interface ReactQueryProviderProps {
  children: React.ReactNode;
  showDevTools?: boolean;
}

export let queryClient: QueryClient;

const ReactQueryProvider = ({ showDevTools, children }: ReactQueryProviderProps) => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retryOnMount: true,
          refetchOnReconnect: false,
          retry: false,
        },
      },
    })
  );

  queryClient = client;

  return (
    <QueryClientProvider client={client}>
      {showDevTools && <ReactQueryDevtools buttonPosition="bottom-left" />}
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
