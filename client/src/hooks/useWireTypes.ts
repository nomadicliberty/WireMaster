import { useQuery } from "@tanstack/react-query";
import { WireType } from "@shared/schema";

export function useWireTypes() {
  const { data: wireTypes, isLoading, error } = useQuery<WireType[]>({
    queryKey: ["/api/wire-types"],
  });

  return {
    wireTypes: wireTypes || [],
    isLoading,
    error
  };
}
