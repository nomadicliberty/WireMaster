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
});

export type InsertWireType = z.infer<typeof insertWireTypeSchema>;
export type WireType = typeof wireTypes.$inferSelect;

// We'll also define a validation schema for calculating wire length
export const calculateSchema = z.object({
  wireTypeId: z.string().min(1), // ✅ fix: string ID
  weight: z.number().positive(),
  weightUnit: z.enum(["lbs", "oz"]),
});


export type CalculateInput = z.infer<typeof calculateSchema>;
