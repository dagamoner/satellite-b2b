import { prisma } from "@repo/database";
import ContratosClient from "../../components/ContratosClient";

export const dynamic = "force-dynamic";

async function getContractData() {
  const agents = await prisma.user.findMany({
    where: {
      role: {
        in: ["TECH", "ADMIN"],
      },
    },
    select: {
      id: true,
      name: true,
      role: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const count = await prisma.installationContract.count();
  // El siguiente ID es el conteo + 1, formateado con ceros a la izquierda (ej: 0041)
  const nextInstallId = (count + 1).toString().padStart(4, "0");

  return { agents, nextInstallId };
}

export default async function ContratosPage() {
  const { agents, nextInstallId } = await getContractData();

  return (
    <ContratosClient 
      agents={agents} 
      nextInstallId={nextInstallId} 
    />
  );
}
