// client/src/context/WireTypesContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { defaultWireTypes } from "@/data/defaultWireTypes";
import { WireType } from "@shared/schema";

const LOCAL_KEY = "customWireTypes";

function getStoredCustomWireTypes(): WireType[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCustomWireTypes(wireTypes: WireType[]) {
  const customOnly = wireTypes.filter(w => w.isDefault === 0);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(customOnly));
}

interface WireTypesContextValue {
  wireTypes: WireType[];
  setWireTypes: (list: WireType[]) => void;
}

const WireTypesContext = createContext<WireTypesContextValue | undefined>(undefined);

export const WireTypesProvider = ({ children }: { children: React.ReactNode }) => {
  const [wireTypes, setWireTypesState] = useState<WireType[]>([]);

  useEffect(() => {
    const stored = getStoredCustomWireTypes();
    setWireTypesState([...defaultWireTypes, ...stored]);
  }, []);

  const setWireTypes = (updated: WireType[]) => {
    setWireTypesState(updated);
    saveCustomWireTypes(updated);
  };

  return (
    <WireTypesContext.Provider value={{ wireTypes, setWireTypes }}>
      {children}
    </WireTypesContext.Provider>
  );
};

export const useWireTypes = () => {
  const context = useContext(WireTypesContext);
  if (!context) throw new Error("useWireTypes must be used within a WireTypesProvider");
  return context;
};
