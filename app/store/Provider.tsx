"use client"
import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode } from 'react';  // Import ReactNode from react

interface ProvidersProps {
  children: ReactNode;  // Explicitly type 'children' as ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}
