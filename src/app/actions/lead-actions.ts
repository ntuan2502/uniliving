"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLead(data: {
  name: string;
  phone: string;
  district: string;
  budget: number;
  note?: string;
}) {
  try {
    const newLead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        district: data.district,
        budget: data.budget,
        note: data.note || "",
        status: "NEW",
      },
    });

    revalidatePath("/admin");
    return { success: true, data: newLead };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to submit request";
    console.error("Error creating lead submission:", error);
    return { success: false, error: errorMessage };
  }
}

export async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: leads };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch leads";
    console.error("Error fetching leads:", error);
    return { success: false, error: errorMessage };
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin");
    return { success: true, data: updatedLead };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update status";
    console.error("Error updating lead status:", error);
    return { success: false, error: errorMessage };
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({
      where: { id },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete lead";
    console.error("Error deleting lead:", error);
    return { success: false, error: errorMessage };
  }
}
