import { Calculator } from "@/components/Calculator";
import { WireTypeManager } from "@/components/WireTypeManager";
import { AlertCircle, Zap } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white sm:text-2xl flex items-center">
            <Zap className="h-6 w-6 mr-2" />
            Wire Measurement Calculator
          </h1>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="text-white hover:text-primary-light" onClick={() => setIsAboutOpen(true)}>
              <AlertCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <Calculator />
          </div>
          <div className="md:col-span-5">
            <WireTypeManager />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Wire Measurement Calculator &copy; {new Date().getFullYear()} - A tool for handsome solar installers & electricians
          </p>
        </div>
      </footer>

      {/* About Dialog */}
      <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              About Wire Measurement Calculator
            </DialogTitle>
            <DialogDescription>
              <p className="mt-2 text-sm text-gray-500 mb-2">
                This tool helps electricians calculate the remaining length of wire based on its weight.
              </p>
              <p className="text-sm text-gray-500 mb-2">
                The calculation uses the formula: <span className="font-medium">Length = (Weight × 250) ÷ (Weight per 250ft)</span>
              </p>
              <p className="text-sm text-gray-500">
                Custom wire types you add are stored and will be available the next time you visit.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsAboutOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
