import { 
  wireTypes, 
  type WireType, 
  type InsertWireType
} from "@shared/schema";
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;

// Interface for storage operations
export interface IStorage {
  getWireTypes(userId: string): Promise<WireType[]>;
  getWireType(userId: string, id: number): Promise<WireType | undefined>;
  createWireType(userId: string, wireType: InsertWireType): Promise<WireType>;
  updateWireType(userId: string, id: number, wireType: WireType): Promise<WireType>;
  deleteWireType(userId: string, id: number): Promise<boolean>;
  seedDefaultWireTypes(userId: string): Promise<void>;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);

export class PostgresStorage implements IStorage {
  async getWireTypes(userId: string): Promise<WireType[]> {
    return await db.select().from(wireTypes).where(eq(wireTypes.userId, userId));
  }

  async getWireType(userId: string, id: number): Promise<WireType | undefined> {
    const results = await db.select().from(wireTypes)
      .where(and(eq(wireTypes.id, id), eq(wireTypes.userId, userId)));
    return results[0];
  }

  async createWireType(userId: string, wireType: InsertWireType): Promise<WireType> {
    const [result] = await db.insert(wireTypes)
      .values({ ...wireType, userId })
      .returning();
    return result;
  }

  async updateWireType(userId: string, id: number, wireType: WireType): Promise<WireType> {
    const [result] = await db.update(wireTypes)
      .set(wireType)
      .where(and(eq(wireTypes.id, id), eq(wireTypes.userId, userId)))
      .returning();
    return result;
  }

  async deleteWireType(userId: string, id: number): Promise<boolean> {
    const result = await db.delete(wireTypes)
      .where(and(eq(wireTypes.id, id), eq(wireTypes.userId, userId)));
    return result.length > 0;
  }

  async seedDefaultWireTypes(userId: string): Promise<void> {
    const existing = await this.getWireTypes(userId);
    if (existing.length === 0) {
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
        await this.createWireType(userId, wireType);
      }
    }
  }
}

export const storage = new PostgresStorage();