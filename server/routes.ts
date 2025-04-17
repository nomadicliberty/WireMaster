import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { insertWireTypeSchema, calculateSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed default wire types
  await storage.seedDefaultWireTypes();

  // Get all wire types
  app.get("/api/wire-types", async (req: Request, res: Response) => {
    try {
      const wireTypes = await storage.getWireTypes();
      return res.status(200).json(wireTypes);
    } catch (error) {
      console.error("Error fetching wire types:", error);
      return res.status(500).json({ message: "Failed to fetch wire types" });
    }
  });

  // Get a specific wire type
  app.get("/api/wire-types/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid wire type ID" });
      }

      const wireType = await storage.getWireType(id);
      if (!wireType) {
        return res.status(404).json({ message: "Wire type not found" });
      }

      return res.status(200).json(wireType);
    } catch (error) {
      console.error("Error fetching wire type:", error);
      return res.status(500).json({ message: "Failed to fetch wire type" });
    }
  });

  // Create a new wire type
  app.post("/api/wire-types", async (req: Request, res: Response) => {
    try {
      const validatedData = insertWireTypeSchema.parse(req.body);
      const wireType = await storage.createWireType(validatedData);
      return res.status(201).json(wireType);
    } catch (error) {
      console.error("Error creating wire type:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Failed to create wire type" });
    }
  });

  // Delete a wire type
  app.delete("/api/wire-types/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid wire type ID" });
      }

      const success = await storage.deleteWireType(id);
      if (!success) {
        return res.status(404).json({ message: "Wire type not found or cannot be deleted (default wire type)" });
      }

      return res.status(200).json({ message: "Wire type deleted successfully" });
    } catch (error) {
      console.error("Error deleting wire type:", error);
      return res.status(500).json({ message: "Failed to delete wire type" });
    }
  });

  // Calculate wire length based on weight
  app.post("/api/calculate", async (req: Request, res: Response) => {
    try {
      const { wireTypeId, weight } = calculateSchema.parse(req.body);
      
      const wireType = await storage.getWireType(wireTypeId);
      if (!wireType) {
        return res.status(404).json({ message: "Wire type not found" });
      }

      // Calculate length: (weight × 100) ÷ (weight per 100ft)
      const length = (weight * 100) / Number(wireType.ratio);
      
      return res.status(200).json({
        wireType,
        weight,
        length
      });
    } catch (error) {
      console.error("Error calculating wire length:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Failed to calculate wire length" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
