// src/hooks/useWireTypes.ts
import { useQuery } from "@tanstack/react-query";
import { defaultWireTypes } from "@/data/defaultWireTypes";
import { WireType } from "@shared/schema";

// LocalStorage Key
const LOCAL_KEY = "customWireTypes";

// Helper to get custom types from localStorage
function getStoredCustomWireTypes(): WireType[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}


// Optional: helper functions to modify localStorage
export function saveCustomWireType(newType: WireType) {
  const current = getStoredCustomWireTypes();
  const updated = [...current, newType];
  localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
}

export function deleteCustomWireType(id: string) {
  const current = getStoredCustomWireTypes();
  const updated = current.filter(w => w.id !== id);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
}
import { useState, useEffect } from "react";
// ...keep the rest of your imports and code...

export function useWireTypes() {
  const [wireTypes, setWireTypes] = useState<WireType[]>([]);

  useEffect(() => {
    const stored = getStoredCustomWireTypes();
    setWireTypes([...defaultWireTypes, ...stored]);
  }, []);

  useEffect(() => {
    const customOnly = wireTypes.filter(w => w.isDefault === 0);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(customOnly));
  }, [wireTypes]);

  return {
    wireTypes,
    setWireTypes,
    isLoading: false,
  };
}
