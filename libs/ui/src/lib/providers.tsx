'use client';
import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DirectionProvider } from '@radix-ui/react-direction';
import type { Direction } from '@store-builder/shared-types';
export function AppProviders({ children, direction='rtl' }: { children:ReactNode; direction?:Direction }) {
 const [client] = useState(() => new QueryClient({defaultOptions:{queries:{staleTime:30_000,retry:1}}}));
 return <QueryClientProvider client={client}><DirectionProvider dir={direction}>{children}</DirectionProvider></QueryClientProvider>;
}

