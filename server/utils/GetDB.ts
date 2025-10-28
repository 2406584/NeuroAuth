import { PrismaClient } from '../../generated/prisma/client';
export function GetDB() {
     return new PrismaClient()
}
