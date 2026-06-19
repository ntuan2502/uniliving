import fs from "fs";
import path from "path";
import { Prisma } from "@prisma-generated";

// Path to mock db.json
const dbPath = path.join(process.cwd(), "src/lib/db.json");

export interface RoomData {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  district: string;
  imageUrl: string[];
  amenities: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadData {
  id: string;
  name: string;
  phone: string;
  district: string;
  budget: number;
  note?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbSchema {
  rooms: RoomData[];
  leads: LeadData[];
}

export type RoomCreateInputCustom = Omit<Prisma.RoomCreateInput, "imageUrl"> & {
  imageUrl?: string | string[];
};

export type RoomUpdateInputCustom = Omit<Prisma.RoomUpdateInput, "imageUrl"> & {
  imageUrl?: string | string[] | Prisma.StringFieldUpdateOperationsInput;
};


// Helper to read DB
function readDb(): DbSchema {
  try {
    if (!fs.existsSync(dbPath)) {
      return { rooms: [], leads: [] };
    }
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data) as DbSchema;
  } catch (error) {
    console.error("Error reading mock database:", error);
    return { rooms: [], leads: [] };
  }
}

// Helper to write DB
function writeDb(data: DbSchema): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing mock database:", error);
  }
}

export const prisma = {
  room: {
    findMany: async (args?: {
      where?: Prisma.RoomWhereInput;
      orderBy?: Prisma.RoomOrderByWithRelationInput | Prisma.RoomOrderByWithRelationInput[];
    }): Promise<RoomData[]> => {
      const db = readDb();
      let rooms = [...db.rooms];

      if (args?.where) {
        const where = args.where;
        
        // Filter by district
        if (typeof where.district === "string" && where.district !== "Tất cả") {
          rooms = rooms.filter((r) => r.district === where.district);
        }

        // Filter by price
        if (where.price && typeof where.price === "object" && "lte" in where.price && typeof where.price.lte === "number") {
          const lte = where.price.lte;
          rooms = rooms.filter((r) => r.price <= lte);
        }

        // Filter by text search
        if (where.OR && Array.isArray(where.OR)) {
          const titleCond = where.OR.find(
            (c) => typeof c.title === "object" && c.title !== null && "contains" in c.title
          );
          if (titleCond && typeof titleCond.title === "object" && titleCond.title !== null && "contains" in titleCond.title && typeof titleCond.title.contains === "string") {
            const query = titleCond.title.contains.toLowerCase();
            rooms = rooms.filter(
              (r) =>
                r.title.toLowerCase().includes(query) ||
                r.description.toLowerCase().includes(query) ||
                r.address.toLowerCase().includes(query)
            );
          }
        }

        // Filter by amenities
        if (where.amenities && typeof where.amenities === "object" && "hasEvery" in where.amenities && Array.isArray(where.amenities.hasEvery)) {
          const required = where.amenities.hasEvery as string[];
          rooms = rooms.filter((r) =>
            required.every((a) => r.amenities.includes(a))
          );
        }
      }

      // Order by createdAt desc
      rooms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return rooms;
    },

    findUnique: async (args: { where: Prisma.RoomWhereUniqueInput }): Promise<RoomData | null> => {
      const db = readDb();
      return db.rooms.find((r) => r.id === args.where.id) || null;
    },

    create: async (args: {
      data: RoomCreateInputCustom;
    }): Promise<RoomData> => {
      const db = readDb();
      // Safely transform imageUrl to array if it is string
      let imageUrls: string[] = ["/placeholder-room.jpg"];
      if (args.data.imageUrl) {
        if (Array.isArray(args.data.imageUrl)) {
          imageUrls = args.data.imageUrl;
        } else if (typeof args.data.imageUrl === "string") {
          imageUrls = [args.data.imageUrl];
        }
      }

      let amenitiesList: string[] = [];
      if (args.data.amenities) {
        if (Array.isArray(args.data.amenities)) {
          amenitiesList = args.data.amenities;
        } else if (typeof args.data.amenities === "object" && "set" in args.data.amenities && Array.isArray(args.data.amenities.set)) {
          amenitiesList = args.data.amenities.set;
        }
      }

      const newRoom: RoomData = {
        id: args.data.id || `room-${Date.now()}`,
        title: args.data.title,
        description: args.data.description,
        price: args.data.price,
        address: args.data.address,
        district: args.data.district,
        imageUrl: imageUrls,
        amenities: amenitiesList,
        status: args.data.status || "AVAILABLE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.rooms.push(newRoom);
      writeDb(db);
      return newRoom;
    },

    update: async (args: {
      where: Prisma.RoomWhereUniqueInput;
      data: RoomUpdateInputCustom;
    }): Promise<RoomData> => {
      const db = readDb();
      const index = db.rooms.findIndex((r) => r.id === args.where.id);
      if (index === -1) throw new Error("Room not found");
      
      const currentRoom = db.rooms[index];

      // Safely update imageUrl
      let imageUrls = currentRoom.imageUrl;
      if (args.data.imageUrl !== undefined) {
        if (Array.isArray(args.data.imageUrl)) {
          imageUrls = args.data.imageUrl;
        } else if (typeof args.data.imageUrl === "string") {
          imageUrls = [args.data.imageUrl];
        } else if (typeof args.data.imageUrl === "object" && args.data.imageUrl !== null && "set" in args.data.imageUrl && typeof args.data.imageUrl.set === "string") {
          imageUrls = [args.data.imageUrl.set];
        }
      }

      // Safely update amenities
      let amenitiesList = currentRoom.amenities;
      if (args.data.amenities !== undefined) {
        if (Array.isArray(args.data.amenities)) {
          amenitiesList = args.data.amenities;
        } else if (typeof args.data.amenities === "object" && args.data.amenities !== null) {
          if ("set" in args.data.amenities && Array.isArray(args.data.amenities.set)) {
            amenitiesList = args.data.amenities.set;
          } else if ("push" in args.data.amenities) {
            const pushVal = args.data.amenities.push;
            if (Array.isArray(pushVal)) {
              amenitiesList = [...amenitiesList, ...pushVal];
            } else if (typeof pushVal === "string") {
              amenitiesList = [...amenitiesList, pushVal];
            }
          }
        }
      }

      const updatedRoom: RoomData = {
        ...currentRoom,
        ...(args.data.title !== undefined && { title: typeof args.data.title === "string" ? args.data.title : currentRoom.title }),
        ...(args.data.description !== undefined && { description: typeof args.data.description === "string" ? args.data.description : currentRoom.description }),
        ...(args.data.price !== undefined && { price: typeof args.data.price === "number" ? args.data.price : currentRoom.price }),
        ...(args.data.address !== undefined && { address: typeof args.data.address === "string" ? args.data.address : currentRoom.address }),
        ...(args.data.district !== undefined && { district: typeof args.data.district === "string" ? args.data.district : currentRoom.district }),
        imageUrl: imageUrls,
        amenities: amenitiesList,
        ...(args.data.status !== undefined && { status: typeof args.data.status === "string" ? args.data.status : currentRoom.status }),
        updatedAt: new Date().toISOString(),
      };

      db.rooms[index] = updatedRoom;
      writeDb(db);
      return updatedRoom;
    },

    delete: async (args: { where: Prisma.RoomWhereUniqueInput }): Promise<{ id: string }> => {
      const db = readDb();
      const initialLength = db.rooms.length;
      db.rooms = db.rooms.filter((r) => r.id !== args.where.id);
      if (db.rooms.length === initialLength) throw new Error("Room not found");
      writeDb(db);
      return { id: args.where.id! };
    },
  },

  lead: {
    findMany: async (args?: {
      orderBy?: Prisma.LeadOrderByWithRelationInput | Prisma.LeadOrderByWithRelationInput[];
    }): Promise<LeadData[]> => {
      const db = readDb();
      const leads = [...db.leads];
      
      let order: "asc" | "desc" = "desc";
      if (args?.orderBy) {
        if (!Array.isArray(args.orderBy) && args.orderBy.createdAt === "asc") {
          order = "asc";
        }
      }

      leads.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return order === "asc" ? timeA - timeB : timeB - timeA;
      });
      return leads;
    },

    create: async (args: {
      data: Prisma.LeadCreateInput | Prisma.LeadUncheckedCreateInput;
    }): Promise<LeadData> => {
      const db = readDb();
      const newLead: LeadData = {
        id: args.data.id || `lead-${Date.now()}`,
        name: args.data.name,
        phone: args.data.phone,
        district: args.data.district,
        budget: args.data.budget,
        note: args.data.note || "",
        status: args.data.status || "NEW",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.leads.push(newLead);
      writeDb(db);
      return newLead;
    },

    update: async (args: {
      where: Prisma.LeadWhereUniqueInput;
      data: Prisma.LeadUpdateInput | Prisma.LeadUncheckedUpdateInput;
    }): Promise<LeadData> => {
      const db = readDb();
      const index = db.leads.findIndex((l) => l.id === args.where.id);
      if (index === -1) throw new Error("Lead not found");
      
      const currentLead = db.leads[index];

      const updatedLead: LeadData = {
        ...currentLead,
        ...(args.data.name !== undefined && { name: typeof args.data.name === "string" ? args.data.name : currentLead.name }),
        ...(args.data.phone !== undefined && { phone: typeof args.data.phone === "string" ? args.data.phone : currentLead.phone }),
        ...(args.data.district !== undefined && { district: typeof args.data.district === "string" ? args.data.district : currentLead.district }),
        ...(args.data.budget !== undefined && { budget: typeof args.data.budget === "number" ? args.data.budget : currentLead.budget }),
        ...(args.data.note !== undefined && { note: typeof args.data.note === "string" ? args.data.note : currentLead.note }),
        ...(args.data.status !== undefined && { status: typeof args.data.status === "string" ? args.data.status : currentLead.status }),
        updatedAt: new Date().toISOString(),
      };

      db.leads[index] = updatedLead;
      writeDb(db);
      return updatedLead;
    },

    delete: async (args: { where: Prisma.LeadWhereUniqueInput }): Promise<{ id: string }> => {
      const db = readDb();
      db.leads = db.leads.filter((l) => l.id !== args.where.id);
      writeDb(db);
      return { id: args.where.id! };
    },
  },
};

export default prisma;
