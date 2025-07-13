import db from "../config/database/database";
import { OrgReq } from "../models/requests";
import { AppError } from "../utils/appError";

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
    if (!org) throw new AppError("Organisation not found", 404);

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
