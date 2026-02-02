import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const row = await prisma.ping.create({
    data: { message: "pong" },
  });

  return Response.json(row);
}
