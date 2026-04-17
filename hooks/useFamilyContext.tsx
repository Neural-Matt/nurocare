'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { FamilyMember } from '@/types';

interface FamilyContextType {
  activeMember: FamilyMember | null; // null = viewing as account holder
  setActiveMember: (member: FamilyMember | null) => void;
}

const FamilyContext = createContext<FamilyContextType>({
  activeMember: null,
  setActiveMember: () => {},
});

export function FamilyProvider({ children }: { children: ReactNode }) {
  const [activeMember, setActiveMember] = useState<FamilyMember | null>(null);
  return (
    <FamilyContext.Provider value={{ activeMember, setActiveMember }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamilyContext() {
  return useContext(FamilyContext);
}
