import { useQuery } from "@tanstack/react-query";
import { WireType } from "@shared/schema";

// Helper function to extract wire size and type
interface ParsedWireName {
  category: string;
  size: number;
  wireType: string;
}

function parseWireName(name: string): ParsedWireName {
  // Default values
  let result: ParsedWireName = {
    category: name, // Fallback to full name
    size: 999, // Default high number for unknown sizes
    wireType: name // Store original name
  };

  // Match patterns like "10/2 NM-B", "12/3 UF-B", etc.
  const sizeMatch = name.match(/^(\d+)\/(\d+)/);
  if (sizeMatch) {
    // Extract the size (first number)
    result.size = parseInt(sizeMatch[1]);
    
    // Determine wire type category
    if (name.includes("NM-B") || name.includes("Romex")) {
      result.category = "Romex";
    } else if (name.includes("MC")) {
      result.category = "MC";
    } else if (name.includes("UF-B")) {
      result.category = "UF-B";
    } else if (name.includes("SER")) {
      result.category = "SER";
    } else if (name.includes("THHN")) {
      result.category = "THHN";
    } else {
      // Try to extract category from the rest of the string
      const typeMatch = name.match(/\d+\/\d+\s+([A-Za-z-]+)/);
      result.category = typeMatch ? typeMatch[1] : "Other";
    }
  } else {
    // Handle custom wire types that don't follow the standard format
    const customCategory = 
      name.includes("Romex") ? "Romex" :
      name.includes("MC") ? "MC" :
      name.includes("UF-B") ? "UF-B" :
      name.includes("SER") ? "SER" :
      name.includes("THHN") ? "THHN" :
      "Other";
    
    result.category = customCategory;
  }

  return result;
}

// Sort wire types by category and size
function sortWireTypes(wireTypes: WireType[]): WireType[] {
  // Category priority order (categories not in this list will be sorted alphabetically)
  const categoryOrder = ["Romex", "MC", "UF-B", "SER", "THHN"];

  return [...wireTypes].sort((a, b) => {
    const parsedA = parseWireName(a.name);
    const parsedB = parseWireName(b.name);

    // First sort by category
    const categoryIndexA = categoryOrder.indexOf(parsedA.category);
    const categoryIndexB = categoryOrder.indexOf(parsedB.category);
    
    // If both categories are in our priority list
    if (categoryIndexA !== -1 && categoryIndexB !== -1) {
      if (categoryIndexA !== categoryIndexB) {
        return categoryIndexA - categoryIndexB;
      }
    } else if (categoryIndexA !== -1) {
      return -1; // A is in priority list, B isn't
    } else if (categoryIndexB !== -1) {
      return 1;  // B is in priority list, A isn't
    } else {
      // Neither in priority list, sort alphabetically by category
      const catCompare = parsedA.category.localeCompare(parsedB.category);
      if (catCompare !== 0) return catCompare;
    }

    // Same category, sort by size (ascending)
    return parsedA.size - parsedB.size;
  });
}

export function useWireTypes() {
  const { data: wireTypesRaw, isLoading, error } = useQuery<WireType[]>({
    queryKey: ["/api/wire-types"],
  });

  // Sort wire types if data is available
  const wireTypes = wireTypesRaw ? sortWireTypes(wireTypesRaw) : [];

  return {
    wireTypes,
    isLoading,
    error
  };
}
