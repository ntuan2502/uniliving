import fs from "fs";
import path from "path";

// Path to mock db.json
const dbPath = path.join(process.cwd(), "src/lib/db.json");

// Helper to read DB
function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      return { rooms: [], leads: [] };
    }
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading mock database:", error);
    return { rooms: [], leads: [] };
  }
}

// Helper to write DB
function writeDb(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing mock database:", error);
  }
}

export const prisma = {
  room: {
    findMany: async (args?: any) => {
      const db = readDb();
      let rooms = [...db.rooms];

      if (args?.where) {
        const where = args.where;
        
        // Filter by district
        if (where.district && where.district !== "Tất cả") {
          rooms = rooms.filter((r: any) => r.district === where.district);
        }

        // Filter by price
        if (where.price && where.price.lte) {
          rooms = rooms.filter((r: any) => r.price <= where.price.lte);
        }

        // Filter by text search
        if (where.OR) {
          const searchCond = where.OR.find((c: any) => c.title?.contains);
          if (searchCond) {
            const query = searchCond.title.contains.toLowerCase();
            rooms = rooms.filter(
              (r: any) =>
                r.title.toLowerCase().includes(query) ||
                r.description.toLowerCase().includes(query) ||
                r.address.toLowerCase().includes(query)
            );
          }
        }

        // Filter by amenities
        if (where.amenities && where.amenities.hasEvery) {
          const required = where.amenities.hasEvery;
          rooms = rooms.filter((r: any) =>
            required.every((a: string) => r.amenities.includes(a))
          );
        }
      }

      // Order by createdAt desc
      rooms.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return rooms;
    },

    findUnique: async (args: { where: { id: string } }) => {
      const db = readDb();
      return db.rooms.find((r: any) => r.id === args.where.id) || null;
    },

    create: async (args: { data: any }) => {
      const db = readDb();
      const newRoom = {
        id: `room-${Date.now()}`,
        ...args.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.rooms.push(newRoom);
      writeDb(db);
      return newRoom;
    },

    update: async (args: { where: { id: string }; data: any }) => {
      const db = readDb();
      const index = db.rooms.findIndex((r: any) => r.id === args.where.id);
      if (index === -1) throw new Error("Room not found");
      const updatedRoom = {
        ...db.rooms[index],
        ...args.data,
        updatedAt: new Date().toISOString(),
      };
      db.rooms[index] = updatedRoom;
      writeDb(db);
      return updatedRoom;
    },

    delete: async (args: { where: { id: string } }) => {
      const db = readDb();
      const initialLength = db.rooms.length;
      db.rooms = db.rooms.filter((r: any) => r.id !== args.where.id);
      if (db.rooms.length === initialLength) throw new Error("Room not found");
      writeDb(db);
      return { id: args.where.id };
    },
  },

  lead: {
    findMany: async (args?: any) => {
      const db = readDb();
      const leads = [...db.leads];
      // Order by createdAt desc
      leads.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return leads;
    },

    create: async (args: { data: any }) => {
      const db = readDb();
      const newLead = {
        id: `lead-${Date.now()}`,
        ...args.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.leads.push(newLead);
      writeDb(db);
      return newLead;
    },

    update: async (args: { where: { id: string }; data: any }) => {
      const db = readDb();
      const index = db.leads.findIndex((l: any) => l.id === args.where.id);
      if (index === -1) throw new Error("Lead not found");
      const updatedLead = {
        ...db.leads[index],
        ...args.data,
        updatedAt: new Date().toISOString(),
      };
      db.leads[index] = updatedLead;
      writeDb(db);
      return updatedLead;
    },

    delete: async (args: { where: { id: string } }) => {
      const db = readDb();
      db.leads = db.leads.filter((l: any) => l.id !== args.where.id);
      writeDb(db);
      return { id: args.where.id };
    },
  },
};

export default prisma;
