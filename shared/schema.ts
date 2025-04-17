import { pgTable, text, serial, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wireTypes = pgTable("wireTypes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ratio: numeric("ratio", { precision: 10, scale: 2 }).notNull(),
  isDefault: integer("isDefault").default(0).notNull(),
});

export const insertWireTypeSchema = createInsertSchema(wireTypes)
  .pick({
    name: true,
    ratio: true,
    isDefault: true,
  })
  .transform((data) => ({
    ...data,
    ratio: typeof data.ratio === 'number' ? String(data.ratio) : data.ratio
  }));

export type InsertWireType = z.infer<typeof insertWireTypeSchema>;
export type WireType = typeof wireTypes.$inferSelect;

// We'll also define a validation schema for calculating wire length
export const calculateSchema = z.object({
  wireTypeId: z.number(),
  weight: z.number().positive(),
  weightUnit: z.enum(["lbs", "oz"]).default("lbs"),
});

export type CalculateInput = z.infer<typeof calculateSchema>;
