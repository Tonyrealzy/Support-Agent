import db from "../config/database/database";
import { OrgReq } from "../models/requests";

export const OrganisationService = {
  createOrganisation: async (data: OrgReq) => {
    return await db.organisation.create({ data });
  },

  getAllOrganisations: async () => {
    return await db.organisation.findMany({ orderBy: { createdAt: "desc" } });
  },

  getOrganisationById: async (id: string) => {
    return await db.organisation.findUnique({
      where: { id },
      include: { documents: true },
    });
  },

  updateOrganisationById: async (id: string, field: string, value: any) => {
    const org = await db.organisation.findUnique({
      where: { id },
    });
    if (!org) throw new Error("Organisation not found");

    return await db.organisation.update({
      where: { id },
      data: { [field]: value },
    });
  },

  deleteOrganisationById: async (id: string) => {
    return await db.organisation.delete({
      where: { id },
    });
  },
};
