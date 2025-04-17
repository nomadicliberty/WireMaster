import { 
  wireTypes, 
  type WireType, 
  type InsertWireType
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  getWireTypes(): Promise<WireType[]>;
  getWireType(id: number): Promise<WireType | undefined>;
  createWireType(wireType: InsertWireType): Promise<WireType>;
  updateWireType(id: number, wireType: WireType): Promise<WireType>;
  deleteWireType(id: number): Promise<boolean>;
  seedDefaultWireTypes(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getWireTypes(userId: string): Promise<WireType[]> {
    // Get default wire types and user's custom wire types
    return await db.select().from(wireTypes)
      .where(eq(wireTypes.isDefault, 1))
      .or(eq(wireTypes.userId, userId));
  }

  async getWireType(id: number): Promise<WireType | undefined> {
    const [wireType] = await db.select().from(wireTypes).where(eq(wireTypes.id, id));
    return wireType || undefined;
  }

  async createWireType(insertWireType: InsertWireType): Promise<WireType> {
    const [wireType] = await db
      .insert(wireTypes)
      .values(insertWireType)
      .returning();
    return wireType;
  }

  async updateWireType(id: number, wireType: WireType): Promise<WireType> {
    const { id: _, ...updateValues } = wireType;
    const [updatedWireType] = await db
      .update(wireTypes)
      .set(updateValues)
      .where(eq(wireTypes.id, id))
      .returning();
    return updatedWireType;
  }

  async deleteWireType(id: number): Promise<boolean> {
    const result = await db
      .delete(wireTypes)
      .where(eq(wireTypes.id, id))
      .returning({ id: wireTypes.id });
    return result.length > 0;
  }

  async seedDefaultWireTypes(): Promise<void> {
    // Check if there are any wire types
    const existingWireTypes = await this.getWireTypes();
    
    // Only seed if there are no wire types yet
    if (existingWireTypes.length === 0) {
      const defaultWireTypes: InsertWireType[] = [
        { name: "10/2 NM-B (Romex)", ratio: "13.0", isDefault: 1 },
        { name: "12/2 NM-B (Romex)", ratio: "8.46", isDefault: 1 },
        { name: "12/3 NM-B (Romex)", ratio: "11.2", isDefault: 1 },
        { name: "14/2 NM-B (Romex)", ratio: "5.84", isDefault: 1 },
        { name: "14/3 NM-B (Romex)", ratio: "7.7", isDefault: 1 },
        { name: "12/2 MC", ratio: "10.76", isDefault: 1 },
        { name: "10/2 UF-B", ratio: "14.0", isDefault: 1 },
        { name: "12/2 UF-B", ratio: "9.5", isDefault: 1 },
        { name: "14/2 UF-B", ratio: "7.275", isDefault: 1 },
        { name: "6/3 SER", ratio: "18.0", isDefault: 1 }
      ];

      for (const wireType of defaultWireTypes) {
        await this.createWireType(wireType);
      }
    }
  }
}

export const storage = new DatabaseStorage();