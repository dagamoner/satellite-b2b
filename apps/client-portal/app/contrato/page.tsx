import { prisma } from "@repo/database";
import ContratosClient from "../../components/ContratosClient";

export const dynamic = "force-dynamic";

async function getContractData() {
  try {
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
    const nextInstallId = (count + 1).toString().padStart(4, "0");

    return { agents, nextInstallId };
  } catch (error) {
    console.error("Error fetching data for contracts:", error);
    // Fallback if DB is not ready or configured
    return { agents: [], nextInstallId: "0001" };
  }
}

export default async function ContratoPage() {
  const { agents, nextInstallId } = await getContractData();

  return (
    <ContratosClient 
      agents={agents} 
      nextInstallId={nextInstallId} 
    />
  );
}
