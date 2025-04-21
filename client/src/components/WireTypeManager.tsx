import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useWireTypes } from "@/hooks/useWireTypes";
import { WireType } from "@shared/schema";

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Wire name is required"),
  ratio: z.coerce.number().positive("Ratio must be greater than 0"),
  isDefault: z.number().default(0),
});

export function WireTypeManager() {
  const { toast } = useToast();
  const { wireTypes, isLoading } = useWireTypes();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingWireType, setEditingWireType] = useState<WireType | null>(null);

  const editWireMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await apiRequest("PUT", `/api/wire-types/${values.id}`, values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Wire type updated successfully",
      });
      setIsAddDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/wire-types"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update wire type",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ratio: undefined,
      isDefault: 0,
    },
  });

  const addWireMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/wire-types", values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "New wire type added successfully",
      });
      setIsAddDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/wire-types"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to add wire type",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const deleteWireMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/wire-types/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Wire type deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wire-types"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete wire type",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingWireType && values.id) {
      // If we're editing an existing wire type
      editWireMutation.mutate(values);
    } else {
      // If we're adding a new wire type
      addWireMutation.mutate(values);
    }
  };

  const handleDeleteWire = (id: number) => {
    deleteWireMutation.mutate(id);
  };

  // Filter custom wire types (non-default)
  const customWireTypes = wireTypes.filter(wireType => wireType.isDefault === 0);

  return (
    <>
      <Card className="shadow-md overflow-hidden mb-4 sm:mb-6">
        <div className="bg-primary px-4 py-3">
          <h2 className="text-lg font-semibold text-white">Manage Wire Types</h2>
        </div>
        <CardContent className="p-3 sm:p-6">
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Add custom wire types to your library or manage existing ones.</p>

          <Button 
            className="w-full mb-6"
            onClick={() => setIsAddDialogOpen(true)}
            variant="default"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Wire Type
          </Button>

          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="text-sm font-medium text-gray-700">Wire Type Library</h3>
            </div>

            <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {/* Default Wire Types Section */}
              <div className="bg-gray-50 px-4 py-2 sticky top-0 z-10 border-t border-b">
                <h3 className="text-sm font-medium text-gray-700">Default Wire Types (Cannot be modified)</h3>
              </div>
              {wireTypes
                .filter(wireType => wireType.isDefault === 1)
                .map((wireType) => (
                  <div key={wireType.id} className="px-4 py-3 flex justify-between items-center bg-gray-50">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{wireType.name}</h4>
                      <p className="text-xs text-gray-500">{wireType.ratio} lbs/250ft</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="text-gray-500 bg-gray-100">Default</Badge>
                    </div>
                  </div>
                ))}

              {/* Custom Wire Types Section */}
              <div className="bg-gray-50 px-4 py-2 sticky top-0 z-10 border-t border-b">
                <h3 className="text-sm font-medium text-gray-700">Your Custom Wire Types</h3>
              </div>
              {wireTypes
                .filter(wireType => wireType.isDefault === 0)
                .map((wireType) => (
                  <div key={wireType.id} className="px-4 py-3 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{wireType.name}</h4>
                      <p className="text-xs text-gray-500">{wireType.ratio} lbs/250ft</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingWireType(wireType);
                          form.reset({
                            id: wireType.id,
                            name: wireType.name,
                            ratio: Number(wireType.ratio),
                            isDefault: wireType.isDefault,
                          });
                          setIsAddDialogOpen(true);
                        }}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWire(wireType.id)}
                        disabled={deleteWireMutation.isPending}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}

              {wireTypes.filter(wireType => wireType.isDefault === 0).length === 0 && (
                <div className="px-4 py-4 text-center text-sm text-gray-500">
                  No custom wire types added yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Your custom wire types are saved in the database.</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference Card */}
      <Card className="shadow-md overflow-hidden">
        <div className="bg-primary px-4 py-3 border-b">
          <h2 className="text-sm font-medium text-white">Quick Reference</h2>
        </div>
        <CardContent className="p-3 sm:p-4">
          <div className="text-xs text-gray-600 space-y-2">
            <p><span className="font-medium">How to use:</span> Select a wire type, enter the weight, and calculate the remaining length.</p>
            <p><span className="font-medium">Add custom wire:</span> Click "Add New Wire Type" and enter the wire name and its weight per 250 feet.</p>
            <p><span className="font-medium">Note:</span> Wire weights are approximate and may vary by manufacturer.</p>
          </div>
        </CardContent>
      </Card>

      {/* Add Wire Type Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingWireType(null);
            form.reset({ name: "", ratio: undefined, isDefault: 0 });
          }
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingWireType ? "Edit Wire Type" : "Add New Wire Type"}</DialogTitle>
            <DialogDescription>
              {editingWireType 
                ? "Edit the details of this wire type." 
                : "Enter the details of the wire type you want to add to your custom library."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Wire Name/Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2/0 THHN Stranded" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Weight per 250 feet</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0.01" 
                          placeholder="e.g., 13.5" 
                          {...field} 
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-sm">lbs/250ft</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs sm:text-sm">
                      Enter the weight of 250 feet of this wire type in pounds.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addWireMutation.isPending || editWireMutation.isPending}
                >
                  {editingWireType ? "Save Changes" : "Add Wire Type"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}