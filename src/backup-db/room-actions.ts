"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma-generated";
import { revalidatePath } from "next/cache";

export interface FilterParams {
  district?: string;
  priceMax?: number;
  searchText?: string;
  amenities?: string[];
}

export async function getRooms(filters?: FilterParams) {
  try {
    const whereClause: Prisma.RoomWhereInput = {};

    if (filters) {
      const { district, priceMax, searchText, amenities } = filters;

      // Filter by district (ignore "Tất cả" or empty)
      if (district && district !== "Tất cả") {
        whereClause.district = district;
      }

      // Filter by maximum price
      if (priceMax && priceMax > 0) {
        whereClause.price = {
          lte: priceMax,
        };
      }

      // Search text in title or description
      if (searchText && searchText.trim() !== "") {
        whereClause.OR = [
          {
            title: {
              contains: searchText,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchText,
              mode: "insensitive",
            },
          },
          {
            address: {
              contains: searchText,
              mode: "insensitive",
            },
          },
        ];
      }

      // Filter by specific amenities
      if (amenities && amenities.length > 0) {
        whereClause.amenities = {
          hasEvery: amenities,
        };
      }
    }

    const rooms = await prisma.room.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: rooms };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch rooms";
    console.error("Error fetching rooms:", error);
    return { success: false, error: errorMessage };
  }
}

export async function getRoomById(id: string) {
  try {
    const room = await prisma.room.findUnique({
      where: { id },
    });
    if (!room) {
      return { success: false, error: "Room not found" };
    }
    return { success: true, data: room };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch room details";
    console.error("Error fetching room details:", error);
    return { success: false, error: errorMessage };
  }
}

export async function createRoom(data: {
  title: string;
  description: string;
  price: number;
  address: string;
  district: string;
  imageUrl: string;
  amenities: string[];
  status?: string;
}) {
  try {
    const newRoom = await prisma.room.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        address: data.address,
        district: data.district,
        imageUrl: data.imageUrl || "/placeholder-room.jpg",
        amenities: data.amenities,
        status: data.status || "AVAILABLE",
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, data: newRoom };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create room";
    console.error("Error creating room:", error);
    return { success: false, error: errorMessage };
  }
}

export async function updateRoom(
  id: string,
  data: {
    title?: string;
    description?: string;
    price?: number;
    address?: string;
    district?: string;
    imageUrl?: string;
    amenities?: string[];
    status?: string;
  }
) {
  try {
    const updatedRoom = await prisma.room.update({
      where: { id },
      data,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, data: updatedRoom };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update room";
    console.error("Error updating room:", error);
    return { success: false, error: errorMessage };
  }
}

export async function deleteRoom(id: string) {
  try {
    await prisma.room.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete room";
    console.error("Error deleting room:", error);
    return { success: false, error: errorMessage };
  }
}
