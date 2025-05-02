import { defaultWireTypes } from './defaultWireTypes';
import type { WireType } from "@shared/schema"; // keep this if you're using the shared type


// Interface for storage operations
export interface IStorage {
  getWireTypes(): Promise<WireType[]>;
  getWireType(id: string): Promise<WireType | undefined>;
  createWireType(wireType: InsertWireType): Promise<WireType>;
  updateWireType(id: number, wireType: WireType): Promise<WireType>;
  deleteWireType(id: number): Promise<boolean>;
  seedDefaultWireTypes(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getWireTypes(): Promise<WireType[]> {
    return defaultWireTypes;
  }
 

  async getWireType(id: string): Promise<WireType | undefined> {
    return defaultWireTypes.find(wt => wt.id === id);
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
        // Romex types
        { name: "8/3 NM-B (Romex)", ratio: "63.20", isDefault: 1 },
        { name: "6/3 NM-B (Romex)", ratio: "88.90", isDefault: 1 },
        { name: "10/2 NM-B (Romex)", ratio: "31.95", isDefault: 1 },
        { name: "10/3 NM-B (Romex)", ratio: "47.05", isDefault: 1 },
        { name: "12/2 NM-B (Romex)", ratio: "21.30", isDefault: 1 },
        { name: "12/3 NM-B (Romex)", ratio: "28.35", isDefault: 1 },
        { name: "14/2 NM-B (Romex)", ratio: "15.80", isDefault: 1 },
        { name: "14/3 NM-B (Romex)", ratio: "19.60", isDefault: 1 },
        // MC types
        { name: "8/2 MC", ratio: "56.66", isDefault: 1 },
        { name: "10/2 MC", ratio: "39.75", isDefault: 1 },
        { name: "10/3 MC", ratio: "49.60", isDefault: 1 },
        { name: "12/2 MC", ratio: "25.30", isDefault: 1 },
        { name: "12/3 MC", ratio: "33.35", isDefault: 1 },
        { name: "12/4 MC", ratio: "38.20", isDefault: 1 },
        { name: "14/2 MC", ratio: "19.10", isDefault: 1 },
        { name: "14/3 MC", ratio: "24.70", isDefault: 1 },
        // UF types
        { name: "8/3 UF-B", ratio: "89.13", isDefault: 1 },
        { name: "10/2 UF-B", ratio: "35.05", isDefault: 1 },
        { name: "12/2 UF-B", ratio: "23.75", isDefault: 1 },
        { name: "14/2 UF-B", ratio: "18.20", isDefault: 1 },
        // SER types
        { name: "6/3 SER", ratio: "47.05", isDefault: 1 }
      ];

      for (const wireType of defaultWireTypes) {
        await this.createWireType(wireType);
      }
    }
  }
}

export const storage = new DatabaseStorage();