import { PrismaClient } from "@prisma/client";
import { config } from "../config";

declare global {
  namespace NodeJS {
    interface Global {}
  }
}

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const db = global.prisma || new PrismaClient();

if (config.app.env === "development") {
  global.prisma = db;
}

export default db;
