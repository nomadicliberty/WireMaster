import { pgTable, text, serial, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wireTypes = pgTable("wireTypes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ratio: numeric("ratio", { precision: 10, scale: 2 }).notNull(),
  isDefault: integer("isDefault").default(0).notNull(),
});

export const insertWireTypeSchema = z.object({
  name: z.string().min(1),
  ratio: z.union([z.string(), z.number()]).transform(val => 
    typeof val === 'number' ? String(val) : val
  ),
  isDefault: z.number().default(0),
  // Optional spool properties for custom wire types
  hasSpool: z.boolean().optional().default(false),
  spoolWeight: z.number().optional(),
  spoolLength: z.number().optional(),
  // Full-roll length for the "used from a full roll" message (defaults to 250ft)
  rollLength: z.number().optional(),
});

export type InsertWireType = z.infer<typeof insertWireTypeSchema>;

// Extended WireType for client use (includes optional spool data)
export interface WireTypeWithSpool {
  id: string;
  name: string;
  ratio: string;
  isDefault: number;
  hasSpool?: boolean;
  spoolWeight?: number;
  spoolLength?: number;
  rollLength?: number;
}

export type WireType = WireTypeWithSpool;

// We'll also define a validation schema for calculating wire length
export const calculateSchema = z.object({
  wireTypeId: z.string().min(1), // ✅ fix: string ID
  weight: z.number().positive(),
  weightUnit: z.enum(["lbs", "oz"]),
});


export type CalculateInput = z.infer<typeof calculateSchema>;
