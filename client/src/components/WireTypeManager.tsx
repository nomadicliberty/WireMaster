import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { useWireTypes } from "@/context/WireTypesContext";
import { WireType } from "@shared/schema";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Wire name is required"),
  ratio: z.coerce.number().positive("Ratio must be greater than 0"),
  isDefault: z.number().default(0),
});

export function WireTypeManager() {
  const { toast } = useToast();
  const { wireTypes, setWireTypes } = useWireTypes();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingWireType, setEditingWireType] = useState<WireType | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ratio: undefined,
      isDefault: 0,
    },

  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedList = [...wireTypes];

    if (values.id) {
      const index = updatedList.findIndex(wt => wt.id === values.id);
      if (index !== -1) {
        updatedList[index] = values as WireType;
      }
    } else {
      const newId = `${Date.now()}`;
      updatedList.push({ ...values, id: newId });
    }

    setWireTypes(updatedList);
    form.reset();
    setIsAddDialogOpen(false);
    setEditingWireType(null);

    toast({
      title: "Saved",
      description: "Wire type saved locally",
    });
  };

  const handleDeleteWire = (id: string) => {
    const updatedList = wireTypes.filter(wt => wt.id !== id);
    setWireTypes(updatedList);
    toast({ title: "Deleted", description: "Custom wire type removed" });
  };

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
            <p>Your custom wire types are saved in your browser and will remain available next time you visit.</p>
          </div>
        </CardContent>
      </Card>
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
          <Button type="submit">
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
