import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CalculateInput, WireType } from "@shared/schema";
import { Calculator as CalculatorIcon, RefreshCw } from "lucide-react";
import { useWireTypes } from "@/hooks/useWireTypes";

export function Calculator() {
  const { toast } = useToast();
  const { wireTypes, isLoading } = useWireTypes();

  const [selectedWireTypeId, setSelectedWireTypeId] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<"lbs" | "oz">("lbs");
  const [result, setResult] = useState<{
    wireType: WireType;
    weight: number;
    weightUnit: string;
    length: number;
  } | null>(null);

  const calculateMutation = useMutation({
    mutationFn: async (data: CalculateInput) => {
      const response = await apiRequest("POST", "/api/calculate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      toast({
        title: "Calculation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const wireTypeId = parseInt(selectedWireTypeId);
    const weightValue = parseFloat(weight);

    if (isNaN(wireTypeId) || isNaN(weightValue) || weightValue <= 0) {
      toast({
        title: "Invalid input",
        description: "Please select a wire type and enter a valid weight.",
        variant: "destructive",
      });
      return;
    }

    calculateMutation.mutate({
      wireTypeId,
      weight: weightValue,
      weightUnit,
    });
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <div className="bg-primary px-4 py-3">
        <h2 className="text-lg font-semibold text-white">Calculate Wire Length</h2>
      </div>
      <CardContent className="p-4 sm:p-6">
        <p className="text-gray-600 mb-6">
          Enter the weight of your remaining wire and select the wire type to calculate the length.
        </p>

        <form onSubmit={handleCalculate}>
          <div className="mb-4">
            <Label htmlFor="wireType" className="mb-1">Wire Type</Label>
            <Select
              value={selectedWireTypeId}
              onValueChange={setSelectedWireTypeId}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select wire type..." />
              </SelectTrigger>
              <SelectContent>
                {/* Default wire types */}
                {wireTypes
                  .filter(wireType => wireType.isDefault === 1)
                  .map((wireType) => (
                    <SelectItem key={wireType.id} value={wireType.id.toString()}>
                      {wireType.name} - {wireType.ratio} lbs/100ft
                    </SelectItem>
                  ))}

                {/* Separator with text */}
                {wireTypes.some(w => w.isDefault === 0) && (
                  <div className="px-2 py-1.5 -mx-1 my-1 border-t border-gray-100 text-xs text-gray-500">
                    Custom Wire Types
                  </div>
                )}

                {/* Custom wire types */}
                {wireTypes
                  .filter(wireType => wireType.isDefault === 0)
                  .map((wireType) => (
                    <SelectItem key={wireType.id} value={wireType.id.toString()}>
                      {wireType.name} - {wireType.ratio} lbs/100ft
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <Label htmlFor="weight" className="mb-1">Wire Weight</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight (up to 2 decimal places)"
                  min="0.01"
                  step="0.01"
                  pattern="^\d*\.?\d{0,2}$"
                  title="Please enter a number with up to 2 decimal places"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="w-24">
                <Select
                  value={weightUnit}
                  onValueChange={(value) => setWeightUnit(value as "lbs" | "oz")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lbs">lbs</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              className="w-full"
              type="submit"
              disabled={calculateMutation.isPending}
            >
              <CalculatorIcon className="h-5 w-5 mr-2" />
              Calculate Length
            </Button>
          </div>
        </form>

        {result && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Results</h3>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-blue-700">
                    For <span className="font-semibold">{result.wireType.name}</span> weighing{" "}
                    <span className="font-semibold">{result.weight}</span> {result.weightUnit}:
                  </p>

                  <div className="mt-2 text-2xl font-bold text-center text-blue-800">
                    <span>{result.length.toFixed(1)}</span>
                    <span className="ml-1 text-lg font-normal">feet</span>
                  </div>

                  <p className="mt-2 text-sm text-blue-600">
                    Based on <span className="font-medium">{result.wireType.ratio}</span> lbs per 100 feet
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="inline-flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Reset
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}