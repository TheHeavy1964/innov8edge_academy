"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PlatformContextType {
  elih: boolean;
  setElih: (value: boolean) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [elih, setElih] = useState(false);

  return (
    <PlatformContext.Provider value={{ elih, setElih }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}
